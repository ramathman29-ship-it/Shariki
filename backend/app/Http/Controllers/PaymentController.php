<?php

namespace App\Http\Controllers;

use App\Models\Request as RequestModel;
use App\Models\Payment;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Transfer;

class PaymentController extends Controller
{
    // حجز المال بعد قبول الطلب
   public static function authorizePayment(RequestModel $requestItem)
{
    if (!$requestItem) {
    return response()->json([
        'success' => false,
        'message' => 'الطلب غير موجود'
    ], 404);
}
    Stripe::setApiKey(config('services.stripe.secret'));

    $amount = $requestItem->poperitys->price;
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
        'status' => 'authorized'
    ]);

    return response()->json([
        'success' => true,
        'client_secret' => $intent->client_secret,
        'payment' => $payment
    ], 201);
}


    
    
    public static function capturePayment(RequestModel $requestItem)
{
    $payment = $requestItem->payment;

    if (!$payment || $payment->status !== 'authorized') {
        return;
    }

    Stripe::setApiKey(env('STRIPE_SECRET'));

    // استرجاع PaymentIntent
    $paymentIntent = PaymentIntent::retrieve(
        $payment->stripe_intent_id
    );

    // تنفيذ القبض (Capture)
    $paymentIntent->capture();

    // تحديث الحالة
    $payment->update([
        'status' => 'paid'
    ]);
}
}