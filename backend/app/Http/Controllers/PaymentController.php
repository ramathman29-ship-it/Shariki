<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Notifications\GenericNotification;
use App\Enums\NotificationType;

class PaymentController extends Controller
{
    /**
     * حجز الدفع في وضع الاختبار
     */
    public static function authorizePayment(RequestModel $requestItem)
    {
        if (!$requestItem) {
            return response()->json([
                'success' => false,
                'message' => 'الطلب غير موجود'
            ], 404);
        }

        if ($requestItem->status !== 'accepted') {
            return response()->json([
                'success' => false,
                'message' => 'الطلب غير مقبول'
            ], 400);
        }

        $existingPayment = Payment::where('request_id', $requestItem->id)
            ->where('status', 'authorized')
            ->first();

        if ($existingPayment) {
            return response()->json([
                'success' => false,
                'message' => 'تم حجز المبلغ مسبقاً لهذا الطلب'
            ], 409);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        // تحديد المبلغ
        if ($requestItem->poperitys->typeRequest->name === 'fullSell') {
            $amount = $requestItem->balance ?? $requestItem->poperitys->price;
        } else {
            $amount = $requestItem->balance ?? ($requestItem->poperitys->price * $requestItem->rate / 100);
        }

        $platformFee = round($amount * 0.015, 2);

        // إنشاء PaymentIntent باستخدام بطاقة الاختبار لتجنب held
        $intent = PaymentIntent::create([
            'amount' => 1000,
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never',
            ],
        ]);

        // إنشاء سجل الدفع في DB
        $payment = Payment::create([
            'request_id' => $requestItem->id,
            'amount_usd' => $amount,
            'platform_fee_usd' => $platformFee,
            'stripe_intent_id' => $intent->id,
            'status' => 'authorized',
            'payment_status' => 'pending',
            'balance' => $amount,
        ]);
        $buyer = $requestItem->user;
        $seller = $requestItem->poperitys->user;
        $url = "/user/requests/{$requestItem->id}";

        $buyer->notify(new GenericNotification(
            "Amount of {$amount} USD has been authorized for the transaction - Waiting for contract confirmation",
            $url,
            NotificationType::PAYMENT_AUTHORIZED
        ));

        $seller->notify(new GenericNotification(
            "Amount of {$amount} USD has been authorized for the transaction - Waiting for contract upload",
            $url,
            NotificationType::PAYMENT_AUTHORIZED
        ));
        return response()->json([
            'success' => true,
            'client_secret' => $intent->client_secret,
            'payment' => $payment
        ], 201);
    }

    /**
     * التقاط الدفع وتحديث أرصدة المستخدمين وحالة الدفع
     */
    public static function capturePayment(RequestModel $requestItem)
    {
        $payment = Payment::where('request_id', $requestItem->id)
            ->where('status', 'authorized')
            ->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'لا يوجد دفع معلق لهذا الطلب'
            ], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));
        $paymentIntent = PaymentIntent::retrieve($payment->stripe_intent_id);

        if ($paymentIntent->status !== 'requires_capture') {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن التقاط الدفع، PaymentIntent غير جاهز',
                'status' => $paymentIntent->status
            ], 400);
        }

        try {
            DB::transaction(function () use ($payment, $paymentIntent, $requestItem) {
                // التقاط المبلغ من Stripe
                $paymentIntent->capture();

                // تحديث حالة الدفع
                $payment->update([
                    'status' => 'paid',
                    'payment_status' => 'done'
                ]);

                // تحديث حالة الطلب
                $requestItem->update(['status' => 'done']);

                $balance = $payment->balance;

                $buyer = $requestItem->user;
                $seller = $requestItem->poperitys->user;

                if ($buyer) {
                    $buyer->budget = ($buyer->budget ?? 0) - $balance;
                    $buyer->save();
                }

                if ($seller) {
                    $seller->budget = ($seller->budget ?? 0) + $balance;
                    $seller->save();
                }
                $url = "/user/requests/{$requestItem->id}";

                $buyer->notify(new GenericNotification(
                    "Amount of {$balance} USD has been successfully deducted - Transaction completed",
                    $url,
                    NotificationType::PAYMENT_CAPTURED
                ));

                $seller->notify(new GenericNotification(
                    "Amount of {$balance} USD has been deposited to your account - Transaction completed",
                    $url,
                    NotificationType::PAYMENT_CAPTURED
                ));
            });
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التقاط الدفع: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم الدفع بنجاح وتم تحديث أرصدة المستخدمين وحالة الدفع',
            'buyer_balance' => $requestItem->user->budget ?? 0,
            'seller_balance' => $requestItem->poperitys->user->budget ?? 0,
            'payment_status' => $payment->payment_status,
            'request_status' => $requestItem->status
        ]);
    }

    /**
     * إلغاء الدفع إذا تغيرت حالة الطلب
     */
    public static function handlePaymentOnStatusChange(RequestModel $requestItem)
    {

        $payment = Payment::where('request_id', $requestItem->id)
            ->where('status', 'authorized')
            ->first();

        if (!$payment) return;

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $intent = PaymentIntent::retrieve($payment->stripe_intent_id);
            $intent->cancel();

            $payment->update([
                'status' => 'canceled',
                'payment_status' => 'canceled'
            ]);

            $seller = $requestItem->poperitys->user;
            $url = "/user/requests/{$requestItem->id}";

            if ($buyer) {
                $buyer->notify(new GenericNotification(
                    "Payment authorization has been canceled - Request was rejected",
                    $url,
                    NotificationType::PAYMENT_CANCELED
                ));
            }
            if ($seller) {
                $seller->notify(new GenericNotification(
                    "Payment authorization has been canceled - Request was rejected",
                    $url,
                    NotificationType::PAYMENT_CANCELED
                ));
            }
        } catch (\Exception $e) {
            // تسجيل الخطأ أو تجاهله حسب الحاجة
        }
    }
}
