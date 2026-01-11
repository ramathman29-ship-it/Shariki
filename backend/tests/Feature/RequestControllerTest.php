<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Models\User;
use App\Models\Poperity;
use App\Models\Request as RequestModel;
use App\Models\TypeRequest;
use App\Notifications\GenericNotification;
use App\Models\Role;
use Stripe\PaymentIntent;
use Mockery;
class RequestControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
        Storage::fake('public'); // لتخزين الملفات بشكل افتراضي
        $intentMock = new \stdClass();
    $intentMock->id = 'pi_test_123';
    $intentMock->client_secret = 'secret_test_123';

    Mockery::mock('alias:' . PaymentIntent::class)
        ->shouldReceive('create')
        ->andReturn($intentMock);
}

public function tearDown(): void
{
    Mockery::close();
    parent::tearDown();
}
    

    /** @test */
    public function test_user_can_create_partial_request_within_available_percentage()
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'available_percentage' => 50,
            'RT_id' => $typeRequest->id
        ]);

        $payload = [
            'prp_id' => $property->id,
            'rate' => 30,
            'description' => 'Partial request test'
        ];

        $response = $this->actingAs($user)->postJson('/api/user/requests', $payload);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('requests', [
            'user_id' => $user->id,
            'prp_id' => $property->id,
            'rate' => 30
        ]);

        Notification::assertSentTo([$owner], GenericNotification::class);
    }

    /** @test */
    public function test_partial_request_rate_greater_than_available_returns_error()
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'available_percentage' => 20,
            'RT_id' => $typeRequest->id
        ]);

        $payload = ['prp_id' => $property->id, 'rate' => 50, 'description' => 'Test'];

        $response = $this->actingAs($user)->postJson('/api/user/requests', $payload);

        $response->assertStatus(400)
                 ->assertJson([
                     'success' => false,
                     'message' => 'the request rate is greater than the available percentage'
                 ]);
    }

    /** @test */
    public function test_user_can_create_full_request_with_rate_100()
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $typeRequest = TypeRequest::factory()->create(['name' => 'fullSell']);
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'RT_id' => $typeRequest->id
        ]);

        $payload = ['prp_id' => $property->id, 'description' => 'Full sell request'];

        $response = $this->actingAs($user)->postJson('/api/user/requests', $payload);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('requests', [
            'user_id' => $user->id,
            'prp_id' => $property->id,
            'rate' => 100
        ]);
    }

    

    /** @test */
    public function test_user_can_update_request_status()
    {
        $user = User::factory()->create();
        $requestOwner = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);
        $requestItem = RequestModel::factory()->create([
            'user_id' => $requestOwner->id,
            'prp_id' => $property->id,
            'status' => 'pending'
        ]);

        $payload = ['status' => 'accepted'];

        $response = $this->actingAs($user)->putJson("/api/user/requests/{$requestItem->id}/status", $payload);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Request accepted successfully']);

        $this->assertDatabaseHas('requests', ['id' => $requestItem->id, 'status' => 'accepted']);
        Notification::assertSentTo([$requestOwner], GenericNotification::class);
    }

    /** @test */
    public function test_user_can_cancel_request()
    {
        $user = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);
        $requestItem = RequestModel::factory()->create(['user_id' => $user->id, 'prp_id' => $property->id]);

        $response = $this->actingAs($user)->deleteJson("/api/user/requests/{$requestItem->id}/cancel");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('requests', ['id' => $requestItem->id]);
    }

    /** @test */
    public function test_user_can_reject_request()
    {
        $user = User::factory()->create();
        $requestOwner = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);
        $requestItem = RequestModel::factory()->create([
            'user_id' => $requestOwner->id,
            'prp_id' => $property->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user)->postJson("/api/user/requests/{$requestItem->id}/rejected");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('requests', ['id' => $requestItem->id, 'is_rejected' => true]);
    }

    /** @test */
    public function test_user_can_make_payment_for_request()
    {
        $user = User::factory()->create();
        $requestOwner = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);
        $requestItem = RequestModel::factory()->create([
            'user_id' => $requestOwner->id,
            'prp_id' => $property->id,
            'payment_status' => 'pending',
            'status' => 'accepted'
        ]);

        $response = $this->actingAs($user)
                         ->postJson("/api/user/requests/{$requestItem->id}/payment");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // توافق مع منطق الـ controller الحالي
        $this->assertDatabaseHas('requests', [
            'id' => $requestItem->id,
            'payment_status' => 'held' // أو 'paid' حسب التطبيق
        ]);
    }

    /** @test */
    public function test_user_cannot_pay_for_request_that_is_not_accepted()
    {
        $user = User::factory()->create();
        $requestOwner = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);
        $requestItem = RequestModel::factory()->create([
            'user_id' => $requestOwner->id,
            'prp_id' => $property->id,
            'payment_status' => 'pending',
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user)
                         ->postJson("/api/user/requests/{$requestItem->id}/payment");

        $response->assertStatus(400)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Request is not accepted yet'
                 ]);
    }
    public function user_can_upload_contract_successfully()
    {
        $owner = User::factory()->create();
        $buyer = User::factory()->create();
    
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole->id);
    
        $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);
    
        $property = Poperity::factory()->create([
            'user_id' => $owner->id,
            'available_percentage' => 50,
            'RT_id' => $typeRequest->id
        ]);
    
        $requestModel = RequestModel::factory()->create([
            'user_id' => $buyer->id,
            'prp_id' => $property->id,
            'rate' => 30,
            'status' => 'accepted'
        ]);
    
        $file = UploadedFile::fake()->image('contract.jpg');
    
        $response = $this->actingAs($admin)
            ->postJson("/api/admin/requests/{$requestModel->id}/contract", [
                'contract' => $file
            ]);
    
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }
    
 
   /** @test */
public function cannot_upload_contract_if_rate_exceeds_available_percentage()
{
    $owner = User::factory()->create();
    $buyer = User::factory()->create();
    $typeRequest = TypeRequest::factory()->create(['name' => 'partialSell']);

    $property = Poperity::factory()->create([
        'user_id' => $owner->id,
        'available_percentage' => 20,
        'RT_id' => $typeRequest->id
    ]);

    $requestModel = RequestModel::factory()->create([
        'user_id' => $buyer->id,
        'prp_id' => $property->id,
        'rate' => 30,
        'status' => 'accepted'
    ]);

    $file = UploadedFile::fake()->image('contract.jpg');

    $admin = User::factory()->create();

    $adminRole = Role::firstOrCreate(['name' => 'admin']);

$admin->roles()->attach($adminRole->id);

    $response = $this->actingAs($admin)
        ->postJson("/api/admin/requests/{$requestModel->id}/contract", [
            'contract' => $file
        ]);

    $response->assertStatus(403)
             ->assertJson([
                 'success' => false,
                 'message' => 'Available percentage less than rate'
             ]);
}


    /** @test */
public function cannot_upload_contract_if_request_not_accepted()
{
    $owner = User::factory()->create();
    $buyer = User::factory()->create();
    $typeRequest = TypeRequest::factory()->create();

    $property = Poperity::factory()->create([
        'user_id' => $owner->id,
        'RT_id' => $typeRequest->id
    ]);

    $requestModel = RequestModel::factory()->create([
        'user_id' => $buyer->id,
        'prp_id' => $property->id,
        'rate' => 10,
        'status' => 'pending'
    ]);

    $file = UploadedFile::fake()->image('contract.jpg');

    $admin = User::factory()->create();

$adminRole = Role::firstOrCreate(['name' => 'admin']);

$admin->roles()->attach($adminRole->id);

    $response = $this->actingAs($admin)
        ->postJson("/api/admin/requests/{$requestModel->id}/contract", [
            'contract' => $file
        ]);

    $response->assertStatus(403)
             ->assertJson([
                 'success' => false,
                 'message' => 'Contract can only be uploaded for accepted requests.'
             ]);
}

     /** @test */
public function unauthorized_user_cannot_upload_contract()
{
    $owner = User::factory()->create();
    $buyer = User::factory()->create();
    $otherUser = User::factory()->create();
    $typeRequest = TypeRequest::factory()->create();

    $property = Poperity::factory()->create([
        'user_id' => $owner->id,
        'RT_id' => $typeRequest->id
    ]);

    $requestModel = RequestModel::factory()->create([
        'user_id' => $buyer->id,
        'prp_id' => $property->id,
        'rate' => 10,
        'status' => 'accepted'
    ]);

    $file = UploadedFile::fake()->image('contract.jpg');

    $response = $this->actingAs($otherUser)
        ->postJson("/api/admin/requests/{$requestModel->id}/contract", [
            'contract' => $file
        ]);

    $response->assertStatus(403)
             ->assertJson([
                 'success' => false,
                 'message' => 'Unauthorized'
             ]);
}

}

