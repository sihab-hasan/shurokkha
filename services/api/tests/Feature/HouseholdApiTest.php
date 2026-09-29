<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseholdApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_household_and_list_members(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/auth/me/household', [
            'head_full_name' => 'Head of Family',
            'phone' => '+8801711111111',
            'address' => '123 River Rd, Dhaka',
            'member_count' => 4,
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.address', '123 River Rd, Dhaka');

        $household = Household::query()->where('user_id', $user->id)->firstOrFail();

        $this->actingAs($user)->postJson('/api/v1/auth/me/household/members', [
            'full_name' => 'Spouse',
            'age' => 30,
            'gender' => 'female',
            'relationship' => 'spouse',
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Spouse');

        $this->actingAs($user)->getJson('/api/v1/auth/me/household/members')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->assertDatabaseHas('household_members', ['household_id' => $household->household_id]);
    }

    public function test_user_cannot_create_two_households(): void
    {
        $user = User::factory()->create();
        Household::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->postJson('/api/v1/auth/me/household', [
            'head_full_name' => 'Other',
            'phone' => '+8801722222222',
            'address' => '456 Different St',
        ])->assertStatus(409);
    }

    public function test_user_can_update_and_delete_member(): void
    {
        $user = User::factory()->create();
        $household = Household::factory()->create(['user_id' => $user->id]);
        $member = HouseholdMember::factory()->create(['household_id' => $household->household_id]);

        $this->actingAs($user)->patchJson("/api/v1/auth/me/household/members/{$member->member_id}", [
            'age' => 31,
        ])->assertOk()->assertJsonPath('data.age', 31);

        $this->actingAs($user)->deleteJson("/api/v1/auth/me/household/members/{$member->member_id}")
            ->assertNoContent();
        $this->assertDatabaseMissing('household_members', ['member_id' => $member->member_id]);
    }

    public function test_other_users_members_are_invisible(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $household = Household::factory()->create(['user_id' => $owner->id]);
        HouseholdMember::factory()->create(['household_id' => $household->household_id]);

        // Other user can hit endpoint but sees their own (empty) list.
        $this->actingAs($other)->getJson('/api/v1/auth/me/household/members')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
