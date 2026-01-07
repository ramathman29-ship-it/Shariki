<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Payment;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    /**
     * حجز الدفع
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

    if ($requestItem->poperitys->typeRequest->name === 'fullSell') {
        $amount = $requestItem->balance ?? $requestItem->poperitys->price;
    } else {
        $amount = $requestItem->balance ?? ($requestItem->poperitys->price * $requestItem->rate / 100);
    }

    $platformFee = round($amount * 0.015, 2);

    $intent = PaymentIntent::create([
        'amount' => (int) ($amount * 100),
        'currency' => 'usd',
        'capture_method' => 'manual',
        'metadata' => [
            'request_id' => $requestItem->id
        ],
    ]);

    $payment = Payment::create([
        'request_id' => $requestItem->id,
        'amount_usd' => $amount,
        'platform_fee_usd' => $platformFee,
        'stripe_intent_id' => $intent->id,
        'status' => 'authorized',
        'balance' => $amount,
    ]);

    return response()->json([
        'success' => true,
        'client_secret' => $intent->client_secret,
        'payment' => $payment
    ], 201);
}


    /**
     * التقاط الدفع وتحديث رصيد المستخدمين
     */
    public static function capturePayment(RequestModel $requestItem)
    {
        $payment = $requestItem->payment;

        if (!$payment || $payment->status !== 'authorized') {
            return response()->json([
                'success' => false,
                'message' => 'لا يوجد دفع معلق لهذا الطلب'
            ], 400);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::retrieve($payment->stripe_intent_id);
        $paymentIntent->capture();

        // تحديث حالة الدفع
        $payment->update(['status' => 'paid']);

        $balance = $payment->balance;

        // خصم المبلغ من المشتري
        $buyer = $requestItem->user;
        $buyer->budget = ($buyer->budget ?? 0) - $balance;
        $buyer->save();

        // إضافة المبلغ إلى صاحب العقار
        $seller = $requestItem->poperitys->user;
        $seller->budget = ($seller->budget ?? 0) + $balance;
        $seller->save();

        return response()->json([
            'success' => true,
            'message' => 'تم الدفع بنجاح وتم تحديث أرصدة المستخدمين',
            'buyer_balance' => $buyer->budget,
            'seller_balance' => $seller->budget,
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

        $intent = PaymentIntent::retrieve($payment->stripe_intent_id);
        $intent->cancel();

        $payment->update(['status' => 'canceled']);
    }
}
