<?php

use App\Http\Controllers\Api\V1\AffectedArea\AdminAffectedAreaController;
use App\Http\Controllers\Api\V1\AssistanceRequest\AssistanceRequestController;
use App\Http\Controllers\Api\V1\Auth\AccountDeletionController;
use App\Http\Controllers\Api\V1\Auth\DataExportController;
use App\Http\Controllers\Api\V1\Auth\LoginAuditController;
use App\Http\Controllers\Api\V1\Auth\NotificationPreferenceController;
use App\Http\Controllers\Api\V1\Auth\PrivacyPreferenceController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Auth\SessionController;
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Disaster\AdminDisasterController;
use App\Http\Controllers\Api\V1\Donation\AdminDonationController;
use App\Http\Controllers\Api\V1\Donation\DonationController;
use App\Http\Controllers\Api\V1\MissingPerson\MissingPersonReportController;
use App\Http\Controllers\Api\V1\RescueTeam\AdminRescueTeamController;
use App\Http\Controllers\Api\V1\Shelter\AdminShelterController;
use App\Http\Controllers\Api\V1\TeamManagement\AdminTeamManagementController;
use App\Http\Controllers\Api\V1\Warehouse\AdminWarehouseController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::get('/health', fn () => response()->json([
        'status' => 'ok',
        'service' => 'Shurokkha API',
        'version' => 'v1',
    ]))->name('health');

    // Browser authentication is session-cookie based. Applying the `web`
    // middleware gives these API endpoints encrypted cookies, sessions, and
    // CSRF protection while the outer API group still provides /api routing.
    Route::middleware('web')->group(function (): void {
        Route::prefix('auth')->name('auth.')->group(function (): void {
            Route::get('/csrf', [AuthController::class, 'csrf'])->name('csrf');
            Route::post('/register', [AuthController::class, 'register'])->name('register');
            Route::post('/login', [AuthController::class, 'login'])->name('login');

            Route::middleware('auth')->group(function (): void {
                Route::get('/me', [AuthController::class, 'me'])->name('me');
                Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            });

            // Self-service `/me/*` settings endpoints. Same auth gate as
            // the auth/me endpoints; per-resource policies (ProfilePolicy,
            // NotificationPreferencePolicy, PrivacyPreferencePolicy,
            // and the `view-session` closure gate) protect ownership.
            Route::middleware('auth')->prefix('me')->name('me.')->group(function (): void {
                // Profile
                Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
                Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
                Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
                Route::delete('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');
                Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

                // Notification preferences
                Route::get('/notification-preferences', [NotificationPreferenceController::class, 'show'])->name('notification-preferences.show');
                Route::put('/notification-preferences', [NotificationPreferenceController::class, 'update'])->name('notification-preferences.update');

                // Privacy preferences + account-level privacy actions
                Route::get('/privacy-preferences', [PrivacyPreferenceController::class, 'show'])->name('privacy-preferences.show');
                Route::put('/privacy-preferences', [PrivacyPreferenceController::class, 'update'])->name('privacy-preferences.update');
                Route::get('/data-export', [DataExportController::class, 'show'])->name('data-export.show');
                Route::post('/data-export', [DataExportController::class, 'store'])->name('data-export.store');
                Route::get('/account-deletion', [AccountDeletionController::class, 'show'])->name('account-deletion.show');
                Route::post('/account-deletion', [AccountDeletionController::class, 'store'])->name('account-deletion.store');
                Route::delete('/account-deletion', [AccountDeletionController::class, 'destroy'])->name('account-deletion.destroy');

                // Sessions — current session, list, sign-out-everywhere
                Route::get('/session', [SessionController::class, 'show'])->name('session.show');
                Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
                Route::post('/sessions/revoke-all', [SessionController::class, 'destroyAll'])->name('sessions.revoke-all');

                // Two-factor — stub enable/disable until TOTP ships
                Route::post('/two-factor/enable', [TwoFactorController::class, 'enable'])->name('two-factor.enable');
                Route::post('/two-factor/disable', [TwoFactorController::class, 'disable'])->name('two-factor.disable');

                // Login history
                Route::get('/login-audits', [LoginAuditController::class, 'index'])->name('login-audits.index');
            });
        });

        Route::middleware('auth')->group(function (): void {
            Route::get('/assistance-requests', [AssistanceRequestController::class, 'index'])->name('assistance-requests.index');
            Route::get('/assistance-requests/stats', [AssistanceRequestController::class, 'stats'])->name('assistance-requests.stats');
            Route::post('/assistance-requests', [AssistanceRequestController::class, 'store'])->name('assistance-requests.store');
            Route::post('/assistance-requests/bulk-cancel', [AssistanceRequestController::class, 'bulkCancel'])->name('assistance-requests.bulkCancel');
            Route::get('/assistance-requests/{assistanceRequest}', [AssistanceRequestController::class, 'show'])->name('assistance-requests.show');
            Route::patch('/assistance-requests/{assistanceRequest}', [AssistanceRequestController::class, 'update'])->name('assistance-requests.update');
            Route::delete('/assistance-requests/{assistanceRequest}', [AssistanceRequestController::class, 'destroy'])->name('assistance-requests.destroy');
            Route::post('/assistance-requests/{assistanceRequest}/cancel', [AssistanceRequestController::class, 'cancel'])->name('assistance-requests.cancel');

            Route::get('/missing-persons', [MissingPersonReportController::class, 'index'])->name('missing-persons.index');
            Route::post('/missing-persons', [MissingPersonReportController::class, 'store'])->name('missing-persons.store');
            Route::post('/missing-persons/bulk-close', [MissingPersonReportController::class, 'bulkClose'])->name('missing-persons.bulkClose');
            Route::get('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'show'])->name('missing-persons.show');
            Route::get('/missing-persons/{missingPersonReport}/photo', [MissingPersonReportController::class, 'photo'])->name('missing-persons.photo');
            Route::patch('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'update'])->name('missing-persons.update');
            Route::delete('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'destroy'])->name('missing-persons.destroy');
            Route::post('/missing-persons/{missingPersonReport}/close', [MissingPersonReportController::class, 'close'])->name('missing-persons.close');

            Route::get('/donations/stats', [DonationController::class, 'stats'])->name('donations.stats');
            Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
            Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
            Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
            Route::post('/donations/{donation}/cancel', [DonationController::class, 'cancel'])->name('donations.cancel');
        });

        Route::prefix('admin')->name('admin.')->group(function (): void {
            Route::get('/disasters', [AdminDisasterController::class, 'index'])->name('disasters.index');

            Route::get('/affected-areas', [AdminAffectedAreaController::class, 'index'])->name('affected-areas.index');
            Route::post('/affected-areas', [AdminAffectedAreaController::class, 'store'])->name('affected-areas.store');
            Route::delete('/affected-areas/{affectedArea}', [AdminAffectedAreaController::class, 'destroy'])->name('affected-areas.destroy');

            Route::get('/rescue-teams', [AdminRescueTeamController::class, 'index'])->name('rescue-teams.index');
            Route::post('/rescue-teams', [AdminRescueTeamController::class, 'store'])->name('rescue-teams.store');
            Route::delete('/rescue-teams/{rescueTeam}', [AdminRescueTeamController::class, 'destroy'])->name('rescue-teams.destroy');

            Route::get('/assignments', [AdminTeamManagementController::class, 'index'])->name('assignments.index');
            Route::post('/assignments', [AdminTeamManagementController::class, 'store'])->name('assignments.store');
            Route::patch('/assignments/{assignment}/status', [AdminTeamManagementController::class, 'updateStatus'])->name('assignments.updateStatus');
            Route::delete('/assignments/{assignment}', [AdminTeamManagementController::class, 'destroy'])->name('assignments.destroy');

            Route::get('/shelters', [AdminShelterController::class, 'index'])->name('shelters.index');
            Route::post('/shelters', [AdminShelterController::class, 'store'])->name('shelters.store');
            Route::delete('/shelters/{shelter}', [AdminShelterController::class, 'destroy'])->name('shelters.destroy');

            Route::get('/warehouses', [AdminWarehouseController::class, 'index'])->name('warehouses.index');
            Route::post('/warehouses', [AdminWarehouseController::class, 'store'])->name('warehouses.store');
            Route::delete('/warehouses/{warehouse}', [AdminWarehouseController::class, 'destroy'])->name('warehouses.destroy');

            Route::get('/donations', [AdminDonationController::class, 'index'])->name('donations.index');
            Route::post('/donations', [AdminDonationController::class, 'store'])->name('donations.store');
            Route::delete('/donations/{donation}', [AdminDonationController::class, 'destroy'])->name('donations.destroy');

            // Reports: Direct Joins and Aggregations matching ahp_joins_and_aggregations.sql
            Route::prefix('reports')->name('reports.')->group(function (): void {
                Route::get('/summary', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'summary'])->name('summary');
                Route::get('/area-severity', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'areaSeverityBreakdown'])->name('area-severity');
                Route::get('/active-teams', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'activeRescueTeamAssignments'])->name('active-teams');
                Route::get('/citizen-stats', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'citizenRequestStats'])->name('citizen-stats');

                Route::get('/inner-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'innerJoin'])->name('inner-join');
                Route::get('/left-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'leftJoin'])->name('left-join');
                Route::get('/right-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'rightJoin'])->name('right-join');
                Route::get('/full-outer-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'fullOuterJoin'])->name('full-outer-join');
            });
        });
    });
});

