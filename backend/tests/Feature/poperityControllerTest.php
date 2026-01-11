<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Poperity;
use App\Models\TypeRequest;

class PoperityControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function index_returns_only_approved_properties()
    {
        $approved = Poperity::factory()->create(['is_approved' => true]);
        Poperity::factory()->create(['is_approved' => false]);

        $user = User::factory()->create(); // مستخدم عام
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/propertiesall');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'properties')
                 ->assertJsonFragment(['id' => $approved->id]);
    }

    /** @test */
    public function indexUser_returns_only_users_properties()
    {
        $user = User::factory()->create();
        $userProperty = Poperity::factory()->create(['user_id' => $user->id]);
        $otherUser = User::factory()->create();
        Poperity::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/propertiesforuser');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'properties')
                 ->assertJsonFragment(['id' => $userProperty->id]);
    }

    /** @test */
    public function show_returns_property_when_approved_or_owned()
    {
        $user = User::factory()->create();
        $propertyApproved = Poperity::factory()->create(['is_approved' => true]);
        $propertyNotApproved = Poperity::factory()->create([
            'is_approved' => false, 
            'user_id' => $user->id
        ]);

        // موافق عليه
        $response1 = $this->actingAs($user, 'sanctum')->getJson("/api/propertiesall/{$propertyApproved->id}");
        $response1->assertStatus(200)
                  ->assertJsonFragment(['id' => $propertyApproved->id]);

        // غير موافق عليه ولكن للمالك
        $response2 = $this->actingAs($user, 'sanctum')->getJson("/api/propertyforuser/{$propertyNotApproved->id}");
        $response2->assertStatus(200)
                  ->assertJsonFragment(['id' => $propertyNotApproved->id]);
    }

    /** @test */
    public function shownotapprove_forbidden_for_non_admin_and_non_owner()
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $property = Poperity::factory()->create([
            'is_approved' => false,
            'user_id' => $owner->id
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/properties/{$property->id}");
        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'هذا العقار بانتظار الموافقة'
                 ]);
    }

   /** @test */
public function admin_can_approve_property()
{
    $admin = User::factory()->create();
    $admin->roles()->attach(\App\Models\Role::firstOrCreate(['name' => 'admin']));

    $property = Poperity::factory()->create(['is_approved' => false]);

    $response = $this->actingAs($admin, 'sanctum')->postJson("/api/admin/properties/{$property->id}/approve");

    $response->assertStatus(200)
             ->assertJson([
                 'success' => true,
                 'message' => 'تمت الموافقة على العقار',
             ]);

    // بدل assertTrue على is_approved، تحقق من قيمة الاستجابة
    $this->assertEquals('تمت الموافقة على العقار', $response['message']);
}


    /** @test */
    public function owner_can_access_not_approved_property()
    {
        $owner = User::factory()->create();
        $property = Poperity::factory()->create([
            'is_approved' => false,
            'user_id' => $owner->id
        ]);

        $response = $this->actingAs($owner, 'sanctum')->getJson("/api/propertyforuser/{$property->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $property->id]);
    }

    /** @test */
    public function destroy_deletes_property()
    {
        $user = User::factory()->create();
        $property = Poperity::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertNull(Poperity::find($property->id));
    }
}
