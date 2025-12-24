<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPayment()
    {
        // 1️⃣ ضبط مفتاح Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        // 2️⃣ إنشاء عملية الدفع
        $paymentIntent = PaymentIntent::create([
            'amount' => 1000, // 10$
            'currency' => 'usd',
            'payment_method_types' => ['card'],
        ]);

        // 3️⃣ إرجاع النتيجة للفرونت
        return response()->json([
            'client_secret' => $paymentIntent->client_secret
        ]);
    }
}
