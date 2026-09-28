<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Seeds a single administrator account matching the credentials
     * pre-filled in the admin app's login form (see
     * `apps/admin/src/components/auth/login-form.tsx`). Changing the
     * password here must be mirrored in the front-end constant.
     */
    public function run(): void
    {
        $adminEmail = 'admin@gmail.com';
        $adminPassword = 'Admin123!';

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin',
                'full_name' => 'Shurokkha Admin',
                'email_verified_at' => now(),
                'phone' => '01700000000',
                'status' => 'active',
                'role' => UserRole::Admin,
                'role_id' => 1,
                'password' => Hash::make($adminPassword),
            ]
        );
    }
}
