<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Alert;
use App\Models\Appeal;
use App\Models\AssistanceRequest;
use App\Models\Complaint;
use App\Models\Document;
use App\Models\Feedback;
use Illuminate\Support\Str;
use App\Models\Fundraise;
use App\Models\Guide;
use App\Models\HelpRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\LoginAudit;
use App\Models\MissingPersonReport;
use App\Models\News;
use App\Models\RescueTeam;
use App\Models\Shelter;
use App\Models\ShelterResidency;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Development/Test seeder.
 *
 * Produces a populated demo dataset across all entities that have
 * factories, so the admin app and reports have non-empty views.
 *
 * NOT registered from DatabaseSeeder — invoke explicitly:
 *
 *     php artisan db:seed --class=TestDataSeeder
 *
 * Idempotency is approximate. For a clean slate, run migrate:fresh
 * first:
 *
 *     php artisan migrate:fresh --seed --seeder=TestDataSeeder
 */
class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure admin exists (mirrors DatabaseSeeder)
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'full_name' => 'Shurokkha Admin',
                'email_verified_at' => now(),
                'phone' => '01700000000',
                'status' => 'active',
                'role' => UserRole::Admin,
                'role_id' => 1,
                'password' => Hash::make('Admin123!'),
            ]
        );

        // Citizens (~15)
        $citizens = User::factory()->count(15)->create([
            'role' => UserRole::User,
            'role_id' => 2,
        ]);

        // News (8) + Alerts (10)
        News::factory()->count(8)->create();
        Alert::factory()->count(10)->create();

        // Fundraises (5) + Guides (6)
        Fundraise::factory()->count(5)->create();
        Guide::factory()->count(6)->create();

        // Rescue teams (5)
        RescueTeam::factory()->count(5)->create();

        // Volunteers — citizen applications (8)
        foreach ($citizens->take(8) as $citizen) {
            Volunteer::factory()->create(['user_id' => $citizen->id]);
        }

        // Donations — raw insert (DonationFactory not yet authored).
        // Real columns: donation_kind, amount, status, user_id,
        // payment_method, campaign_title, receipt_number, currency.
        $kinds = ['money', 'goods', 'service'];
        $methods = ['bkash', 'nagad', 'rocket', 'bank', 'card'];
        for ($i = 0; $i < 10; $i++) {
            $donationId = DB::table('donations')->insertGetId([
                'donation_kind' => $kinds[array_rand($kinds)],
                'amount' => random_int(100, 50000),
                'status' => ['pending', 'received', 'distributed'][array_rand(['pending', 'received', 'distributed'])],
                'user_id' => $citizens->random()->id,
                'payment_method' => $methods[array_rand($methods)],
                'campaign_title' => 'Test Campaign ' . ($i + 1),
                'receipt_number' => 'DON-' . Str::upper(Str::random(8)),
                'currency' => 'BDT',
                'created_at' => now()->subMinutes(random_int(1, 10000)),
                'updated_at' => now(),
            ]);
        }

        // Assistance Requests (10) + Missing Person Reports (8)
        AssistanceRequest::factory()->count(10)->create();
        MissingPersonReport::factory()->count(8)->create();

        // Help Requests (10) + Complaints (8) + Feedback (10) + Appeals (5)
        HelpRequest::factory()->count(10)->create();
        Complaint::factory()->count(8)->create();
        Feedback::factory()->count(10)->create();
        Appeal::factory()->count(5)->create();

        // Households + members for first 5 citizens
        foreach ($citizens->take(5) as $citizen) {
            $household = Household::factory()->create(['user_id' => $citizen->id]);
            HouseholdMember::factory()->count(3)->create([
                'household_id' => $household->household_id,
            ]);
        }

        // Documents (12) for first 6 citizens
        foreach ($citizens->take(6) as $citizen) {
            Document::factory()->count(2)->create(['user_id' => $citizen->id]);
        }

        // Shelter residencies — 6 active check-ins (ShelterFactory exists,
        // but we only need the IDs so we use raw create rather than
        // calling factory()->count()).
        $residencyCitizens = $citizens->take(6);
        foreach ($residencyCitizens as $citizen) {
            // Pick a random shelter id via raw SQL to avoid coupling to
            // any specific ShelterFactory schema details.
            $shelterId = DB::selectOne('SELECT shelter_id FROM shelters ORDER BY RAND() LIMIT 1');
            if (! $shelterId) {
                break;
            }
            ShelterResidency::factory()->create([
                'user_id' => $citizen->id,
                'shelter_id' => $shelterId->shelter_id,
                'status' => 'checked_in',
            ]);
        }

        // Login audits — ~20 entries across first 5 citizens
        foreach ($citizens->take(5) as $citizen) {
            LoginAudit::factory()->count(4)->create(['user_id' => $citizen->id]);
        }

        $this->command?->info(sprintf(
            'TestDataSeeder complete. Users: %d, rows inserted: %d.',
            User::count(),
            $this->roughTotal(),
        ));
    }

    private function roughTotal(): int
    {
        return (int) DB::selectOne('
            SELECT
                (SELECT COUNT(*) FROM news)
              + (SELECT COUNT(*) FROM alerts)
              + (SELECT COUNT(*) FROM fundraises)
              + (SELECT COUNT(*) FROM guides)
              + (SELECT COUNT(*) FROM rescue_teams)
              + (SELECT COUNT(*) FROM volunteers)
              + (SELECT COUNT(*) FROM donations)
              + (SELECT COUNT(*) FROM emergency_requests)
              + (SELECT COUNT(*) FROM missing_person_reports)
              + (SELECT COUNT(*) FROM help_requests)
              + (SELECT COUNT(*) FROM complaints)
              + (SELECT COUNT(*) FROM feedback)
              + (SELECT COUNT(*) FROM appeals)
              + (SELECT COUNT(*) FROM households)
              + (SELECT COUNT(*) FROM household_members)
              + (SELECT COUNT(*) FROM documents)
              + (SELECT COUNT(*) FROM shelter_residencies)
              + (SELECT COUNT(*) FROM login_audits)
            AS total
        ')->total;
    }
}
