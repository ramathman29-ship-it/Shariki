<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Poperity;
use App\Models\Request as RequestModel;
use App\Models\TypeRequest;
use App\Models\Payment;
use App\Http\Controllers\PaymentController;
use Stripe\PaymentIntent;
use Mockery;

class PaymentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // أي إعداد إضافي قبل كل test
    }

    /** @test */
    public function it_authorizes_payment_successfully_for_accepted_request()
    {
        $buyer = User::factory()->create();
        $owner = User::factory()->create();

        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'price' => 1000,
            'available_percentage' => 50,
            'RT_id' => $typeRequest->id
        ]);

        $requestItem = RequestModel::factory()->create([
            'user_id' => $buyer->id,
            'prp_id' => $property->id,
            'rate' => 30,
            'status' => 'accepted'
        ]);

        $intentMock = new \stdClass();
        $intentMock->id = 'pi_test_123';
        $intentMock->client_secret = 'secret_test_123';

        Mockery::mock('alias:' . PaymentIntent::class)
            ->shouldReceive('create')
            ->once()
            ->andReturn($intentMock);

        $response = PaymentController::authorizePayment($requestItem);
        $data = $response->getData(true);

        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('payment', $data);
        $this->assertEquals('authorized', $data['payment']['status']);
        $this->assertEquals(300, $data['payment']['balance']); // 1000 * 30%
        $this->assertEquals('pi_test_123', $data['payment']['stripe_intent_id']);
    }

    /** @test */
    public function it_fails_to_authorize_payment_for_non_accepted_request()
    {
        $buyer = User::factory()->create();
        $owner = User::factory()->create();

        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'price' => 1000,
            'available_percentage' => 50,
            'RT_id' => $typeRequest->id
        ]);

        $requestItem = RequestModel::factory()->create([
            'user_id' => $buyer->id,
            'prp_id' => $property->id,
            'rate' => 30,
            'status' => 'pending'
        ]);

        $response = PaymentController::authorizePayment($requestItem);
        $data = $response->getData(true);

        $this->assertFalse($data['success']);
        $this->assertEquals('الطلب غير مقبول', $data['message']);
    }

 /** @test */
public function it_captures_payment_successfully()
{
    $buyer = User::factory()->create(['budget' => 5000]);
    $seller = User::factory()->create(['budget' => 1000]);

    $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
    $property = Poperity::factory()->create([
        'user_id' => $seller->id,
        'price' => 1000,
        'available_percentage' => 50,
        'RT_id' => $typeRequest->id
    ]);

    $requestItem = RequestModel::factory()->create([
        'user_id' => $buyer->id,
        'prp_id' => $property->id,
        'rate' => 30,
        'status' => 'accepted'
    ]);

    $payment = Payment::create([
        'request_id' => $requestItem->id,
        'status' => 'authorized',
        'balance' => 300,
        'stripe_intent_id' => 'pi_test_123',
        'amount_usd' => 300,
        'platform_fee_usd' => 4.5,
        'payment_status' => 'pending'
    ]);

    // Mock كامل للـ PaymentIntent
    $mockIntent = Mockery::mock();
    $mockIntent->status = 'requires_capture';
    $mockIntent->shouldReceive('capture')
               ->once()
               ->andReturnUsing(function () use ($mockIntent) {
                   $mockIntent->status = 'succeeded';
                   return $mockIntent;
               });

    // Mock استدعاء overload
    Mockery::mock('overload:' . PaymentIntent::class)
           ->shouldReceive('retrieve')
           ->with('pi_test_123')
           ->andReturn($mockIntent);

    $response = PaymentController::capturePayment($requestItem);
    $data = $response->getData(true);
    $this->assertTrue($data['success'], 'Capture should succeed');
    $this->assertEquals('paid', $payment->fresh()->status);
    $this->assertEquals(4700, $buyer->fresh()->budget); // 5000 - 300
    $this->assertEquals(1300, $seller->fresh()->budget); // 1000 + 300
    $this->assertEquals('done', $requestItem->fresh()->status);
}

    /** @test */
    public function it_fails_to_capture_if_no_authorized_payment()
    {
        $requestItem = RequestModel::factory()->create(['status' => 'accepted']);
        $response = PaymentController::capturePayment($requestItem);
        $data = $response->getData(true);

        $this->assertFalse($data['success']);
        $this->assertEquals('لا يوجد دفع معلق لهذا الطلب', $data['message']);
    }

    /** @test */
    public function it_fails_to_capture_if_payment_intent_not_ready()
    {
        $requestItem = RequestModel::factory()->create(['status' => 'accepted']);
        $payment = Payment::create([
            'request_id' => $requestItem->id,
            'status' => 'authorized',
            'balance' => 300,
            'stripe_intent_id' => 'pi_test_123',
            'amount_usd' => 300,
            'platform_fee_usd' => 4.5
        ]);

        $intentMock = Mockery::mock('overload:' . PaymentIntent::class);
        $intentMock->shouldReceive('retrieve')->with('pi_test_123')->andReturnSelf();
        $intentMock->status = 'requires_payment_method';
        $intentMock->shouldNotReceive('capture');

        $response = PaymentController::capturePayment($requestItem);
        $data = $response->getData(true);

        $this->assertFalse($data['success']);
        $this->assertEquals('لا يمكن التقاط الدفع، PaymentIntent غير جاهز', $data['message']);
    }

    /** @test */
    public function it_cancels_authorized_payment_when_request_status_changes()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
        $property = Poperity::factory()->create([
            'user_id' => $seller->id,
            'price' => 1000,
            'RT_id' => $typeRequest->id
        ]);

        $requestItem = RequestModel::factory()->create([
            'user_id' => $buyer->id,
            'prp_id' => $property->id,
            'status' => 'accepted'
        ]);

        $payment = Payment::create([
            'request_id' => $requestItem->id,
            'status' => 'authorized',
            'balance' => 300,
            'stripe_intent_id' => 'pi_test_123',
            'amount_usd' => 300,
            'platform_fee_usd' => 4.5
        ]);

        $intentMock = Mockery::mock('overload:' . PaymentIntent::class);
        $intentMock->shouldReceive('retrieve')->with('pi_test_123')->andReturnSelf();
        $intentMock->shouldReceive('cancel')->once()->andReturnTrue();

        PaymentController::handlePaymentOnStatusChange($requestItem);

        $this->assertEquals('canceled', $payment->fresh()->status);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
