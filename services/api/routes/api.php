<?php

use App\Http\Controllers\Api\V1\AffectedArea\AdminAffectedAreaController;
use App\Http\Controllers\Api\V1\Alert\AdminAlertController;
use App\Http\Controllers\Api\V1\Appeal\AdminAppealController;
use App\Http\Controllers\Api\V1\AssistanceRequest\AssistanceRequestController;
use App\Http\Controllers\Api\V1\Auth\AccountDeletionController;
use App\Http\Controllers\Api\V1\Auth\AdminLoginAuditController;
use App\Http\Controllers\Api\V1\Auth\AdminUserController;
use App\Http\Controllers\Api\V1\Auth\DataExportController;
use App\Http\Controllers\Api\V1\Auth\LoginAuditController;
use App\Http\Controllers\Api\V1\Auth\NotificationPreferenceController;
use App\Http\Controllers\Api\V1\Auth\PrivacyPreferenceController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Auth\SessionController;
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Complaint\AdminComplaintController;
use App\Http\Controllers\Api\V1\Disaster\AdminDisasterController;
use App\Http\Controllers\Api\V1\Document\DocumentController;
use App\Http\Controllers\Api\V1\Donation\AdminDonationController;
use App\Http\Controllers\Api\V1\Donation\DonationController;
use App\Http\Controllers\Api\V1\EmergencyRequest\AdminEmergencyRequestController;
use App\Http\Controllers\Api\V1\Feedback\AdminFeedbackController;
use App\Http\Controllers\Api\V1\Fundraise\AdminFundraiseController;
use App\Http\Controllers\Api\V1\Guide\AdminGuideController;
use App\Http\Controllers\Api\V1\HelpRequest\AdminHelpRequestController;
use App\Http\Controllers\Api\V1\Household\CitizenHouseholdController;
use App\Http\Controllers\Api\V1\MissingPerson\MissingPersonReportController;
use App\Http\Controllers\Api\V1\News\AdminNewsController;
use App\Http\Controllers\Api\V1\Public\PublicAffectedAreaController;
use App\Http\Controllers\Api\V1\Public\PublicAlertController;
use App\Http\Controllers\Api\V1\Public\PublicDisasterController;
use App\Http\Controllers\Api\V1\Public\PublicFundraiseController;
use App\Http\Controllers\Api\V1\Public\PublicGuideController;
use App\Http\Controllers\Api\V1\Public\PublicNewsController;
use App\Http\Controllers\Api\V1\Public\PublicProfileController;
use App\Http\Controllers\Api\V1\Public\PublicShelterController;
use App\Http\Controllers\Api\V1\RescueTeam\AdminRescueTeamController;
use App\Http\Controllers\Api\V1\Shelter\AdminShelterController;
use App\Http\Controllers\Api\V1\ShelterResidency\AdminShelterResidencyController;
use App\Http\Controllers\Api\V1\ShelterResidency\CitizenShelterResidencyController;
use App\Http\Controllers\Api\V1\TeamManagement\AdminTeamManagementController;
use App\Http\Controllers\Api\V1\Volunteer\AdminVolunteerController;
use App\Http\Controllers\Api\V1\Volunteer\CitizenVolunteerController;
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
        // Public, guest-accessible reads. Live inside the `web` group so
        // they share the same session + CSRF cookie behavior as the auth
        // endpoints, but do NOT require authentication.
        Route::prefix('public')->name('public.')->group(function (): void {
            Route::get('/disasters', [PublicDisasterController::class, 'index'])->name('disasters.index');
            Route::get('/disasters/{disaster}', [PublicDisasterController::class, 'show'])
                ->whereNumber('disaster')->name('disasters.show');

            Route::get('/shelters', [PublicShelterController::class, 'index'])->name('shelters.index');
            Route::get('/shelters/{shelter}', [PublicShelterController::class, 'show'])
                ->whereNumber('shelter')->name('shelters.show');

            Route::get('/affected-areas', [PublicAffectedAreaController::class, 'index'])->name('affected-areas.index');

            Route::get('/alerts', [PublicAlertController::class, 'index'])->name('alerts.index');
            Route::get('/alerts/{alert}', [PublicAlertController::class, 'show'])
                ->whereNumber('alert')->name('alerts.show');

            Route::get('/news', [PublicNewsController::class, 'index'])->name('news.index');
            Route::get('/news/{slug}', [PublicNewsController::class, 'show'])
                ->where('slug', '[A-Za-z0-9._-]+')
                ->name('news.show');

            Route::get('/fundraises', [PublicFundraiseController::class, 'index'])->name('fundraises.index');
            Route::get('/fundraises/{slug}', [PublicFundraiseController::class, 'show'])
                ->where('slug', '[A-Za-z0-9._-]+')
                ->name('fundraises.show');

            Route::get('/guides', [PublicGuideController::class, 'index'])->name('guides.index');
            Route::get('/guides/{slug}', [PublicGuideController::class, 'show'])
                ->where('slug', '[A-Za-z0-9._-]+')
                ->name('guides.show');

            Route::get('/profiles/{username}', [PublicProfileController::class, 'show'])
                ->where('username', '[A-Za-z0-9._-]+')
                ->name('profiles.show');
        });

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

                // Sessions — current session, list, sign-out-everywhere, sign-out-one
                Route::get('/session', [SessionController::class, 'show'])->name('session.show');
                Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
                Route::delete('/sessions/{sessionId}', [SessionController::class, 'destroyOne'])
                    ->where('sessionId', '[A-Za-z0-9]+')
                    ->name('sessions.destroy');
                Route::post('/sessions/revoke-all', [SessionController::class, 'destroyAll'])->name('sessions.revoke-all');

                // Two-factor — stub enable/disable until TOTP ships
                Route::post('/two-factor/enable', [TwoFactorController::class, 'enable'])->name('two-factor.enable');
                Route::post('/two-factor/disable', [TwoFactorController::class, 'disable'])->name('two-factor.disable');

                // Login history
                Route::get('/login-audits', [LoginAuditController::class, 'index'])->name('login-audits.index');

                // Volunteer application (citizen self-service)
                Route::get('/volunteer', [CitizenVolunteerController::class, 'show'])->name('volunteer.show');
                Route::post('/volunteer', [CitizenVolunteerController::class, 'store'])->name('volunteer.store');
                Route::patch('/volunteer', [CitizenVolunteerController::class, 'update'])->name('volunteer.update');

                // Household — one household per user (create-or-update pattern)
                Route::get('/household', [CitizenHouseholdController::class, 'show'])->name('household.show');
                Route::post('/household', [CitizenHouseholdController::class, 'store'])->name('household.store');
                Route::patch('/household', [CitizenHouseholdController::class, 'update'])->name('household.update');

                // Household members — nested under household
                Route::get('/household/members', [CitizenHouseholdController::class, 'indexMembers'])->name('household.members.index');
                Route::post('/household/members', [CitizenHouseholdController::class, 'storeMember'])->name('household.members.store');
                Route::patch('/household/members/{member}', [CitizenHouseholdController::class, 'updateMember'])
                    ->whereNumber('member')->name('household.members.update');
                Route::delete('/household/members/{member}', [CitizenHouseholdController::class, 'destroyMember'])
                    ->whereNumber('member')->name('household.members.destroy');

                // Complaints (citizen submits, admin reviews — same controller)
                Route::get('/complaints', [AdminComplaintController::class, 'indexMine'])->name('complaints.index');
                Route::post('/complaints', [AdminComplaintController::class, 'store'])->name('complaints.store');
                Route::get('/complaints/{complaint}', [AdminComplaintController::class, 'show'])
                    ->whereNumber('complaint')->name('complaints.show');

                // Feedback (citizen submits, admin responds — same controller)
                Route::get('/feedback', [AdminFeedbackController::class, 'indexMine'])->name('feedback.index');
                Route::post('/feedback', [AdminFeedbackController::class, 'store'])->name('feedback.store');
                Route::get('/feedback/{feedback}', [AdminFeedbackController::class, 'show'])
                    ->whereNumber('feedback')->name('feedback.show');

                // Help requests (citizen submits, admin assigns — same controller)
                Route::get('/help-requests', [AdminHelpRequestController::class, 'indexMine'])->name('help-requests.index');
                Route::post('/help-requests', [AdminHelpRequestController::class, 'store'])->name('help-requests.store');
                Route::get('/help-requests/{helpRequest}', [AdminHelpRequestController::class, 'show'])
                    ->whereNumber('helpRequest')->name('help-requests.show');

                // Documents — multipart upload; ownership enforced in controller
                Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
                Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
                Route::get('/documents/{document}', [DocumentController::class, 'show'])
                    ->whereNumber('document')->name('documents.show');
                Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])
                    ->whereNumber('document')->name('documents.destroy');

                // Appeals (citizen submits, admin reviews — same controller)
                Route::get('/appeals', [AdminAppealController::class, 'indexMine'])->name('appeals.index');
                Route::post('/appeals', [AdminAppealController::class, 'store'])->name('appeals.store');
                Route::get('/appeals/{appeal}', [AdminAppealController::class, 'show'])
                    ->whereNumber('appeal')->name('appeals.show');

                // Shelter residency — self check-in / check-out
                Route::get('/shelter-residency', [CitizenShelterResidencyController::class, 'show'])->name('shelter-residency.show');
                Route::post('/shelter-residency', [CitizenShelterResidencyController::class, 'store'])->name('shelter-residency.store');
                Route::patch('/shelter-residency/checkout', [CitizenShelterResidencyController::class, 'checkout'])->name('shelter-residency.checkout');
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
            Route::get('/donations/by-receipt/{receiptNumber}', [DonationController::class, 'showByReceipt'])
                ->where('receiptNumber', 'DON-[A-Za-z0-9\-]+')
                ->name('donations.showByReceipt');
            Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
            Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
            Route::post('/donations/{donation}/cancel', [DonationController::class, 'cancel'])->name('donations.cancel');
        });

            // Admin endpoints are gated by `auth + role:admin`. Without the
            // role middleware every authenticated user would be able to mutate
            // any resource via these routes — security-critical.
            Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
                Route::apiResource('disasters', AdminDisasterController::class)->names('disasters');

                Route::get('/affected-areas', [AdminAffectedAreaController::class, 'index'])->name('affected-areas.index');
                Route::post('/affected-areas', [AdminAffectedAreaController::class, 'store'])->name('affected-areas.store');
                Route::delete('/affected-areas/{affectedArea}', [AdminAffectedAreaController::class, 'destroy'])->name('affected-areas.destroy');

                Route::get('/rescue-teams', [AdminRescueTeamController::class, 'index'])->name('rescue-teams.index');
                Route::post('/rescue-teams', [AdminRescueTeamController::class, 'store'])->name('rescue-teams.store');
                Route::delete('/rescue-teams/{rescueTeam}', [AdminRescueTeamController::class, 'destroy'])->name('rescue-teams.destroy');

                Route::get('/emergency-requests', [AdminEmergencyRequestController::class, 'index'])->name('emergency-requests.index');
                Route::get('/emergency-requests/{emergencyRequest}', [AdminEmergencyRequestController::class, 'show'])
                    ->whereNumber('emergencyRequest')->name('emergency-requests.show');
                Route::patch('/emergency-requests/{emergencyRequest}', [AdminEmergencyRequestController::class, 'update'])
                    ->whereNumber('emergencyRequest')->name('emergency-requests.update');
                Route::delete('/emergency-requests/{emergencyRequest}', [AdminEmergencyRequestController::class, 'destroy'])
                    ->whereNumber('emergencyRequest')->name('emergency-requests.destroy');

                Route::get('/assignments', [AdminTeamManagementController::class, 'index'])->name('assignments.index');
                Route::post('/assignments', [AdminTeamManagementController::class, 'store'])->name('assignments.store');
                Route::patch('/assignments/{assignment}/status', [AdminTeamManagementController::class, 'updateStatus'])->name('assignments.updateStatus');
                Route::delete('/assignments/{assignment}', [AdminTeamManagementController::class, 'destroy'])->name('assignments.destroy');

                Route::get('/shelters', [AdminShelterController::class, 'index'])->name('shelters.index');
                Route::post('/shelters', [AdminShelterController::class, 'store'])->name('shelters.store');
                Route::get('/shelters/{shelter}', [AdminShelterController::class, 'show'])
                    ->whereNumber('shelter')->name('shelters.show');
                Route::patch('/shelters/{shelter}', [AdminShelterController::class, 'update'])
                    ->whereNumber('shelter')->name('shelters.update');
                Route::patch('/shelters/{shelter}/occupancy', [AdminShelterController::class, 'updateOccupancy'])->name('shelters.occupancy');
                Route::delete('/shelters/{shelter}', [AdminShelterController::class, 'destroy'])->name('shelters.destroy');

                Route::get('/warehouses', [AdminWarehouseController::class, 'index'])->name('warehouses.index');
                Route::post('/warehouses', [AdminWarehouseController::class, 'store'])->name('warehouses.store');
                Route::post('/warehouses/{warehouse}/distribute', [AdminWarehouseController::class, 'distributeRelief'])->name('warehouses.distribute');
                Route::delete('/warehouses/{warehouse}', [AdminWarehouseController::class, 'destroy'])->name('warehouses.destroy');

                Route::get('/donations', [AdminDonationController::class, 'index'])->name('donations.index');
                Route::post('/donations', [AdminDonationController::class, 'store'])->name('donations.store');
                Route::delete('/donations/{donation}', [AdminDonationController::class, 'destroy'])->name('donations.destroy');

                // Phase 2 admin surfaces (alerts / news / fundraises / guides / volunteers)
                Route::apiResource('alerts', AdminAlertController::class)->names('alerts');
                Route::apiResource('news', AdminNewsController::class)->names('news');
                Route::apiResource('fundraises', AdminFundraiseController::class)->names('fundraises');
                Route::apiResource('guides', AdminGuideController::class)->names('guides');

                Route::get('/volunteers', [AdminVolunteerController::class, 'index'])->name('volunteers.index');
                Route::get('/volunteers/{volunteer}', [AdminVolunteerController::class, 'show'])
                    ->whereNumber('volunteer')->name('volunteers.show');
                Route::patch('/volunteers/{volunteer}/review', [AdminVolunteerController::class, 'review'])
                    ->whereNumber('volunteer')->name('volunteers.review');
                Route::delete('/volunteers/{volunteer}', [AdminVolunteerController::class, 'destroy'])
                    ->whereNumber('volunteer')->name('volunteers.destroy');

                // Phase 3 admin surfaces (complaints / feedback / help-requests / documents / appeals / shelter-residencies)
                Route::apiResource('complaints', AdminComplaintController::class)->names('complaints');
                Route::patch('/complaints/{complaint}/review', [AdminComplaintController::class, 'review'])
                    ->whereNumber('complaint')->name('complaints.review');

                Route::apiResource('feedback', AdminFeedbackController::class)->names('feedback');
                Route::patch('/feedback/{feedback}/respond', [AdminFeedbackController::class, 'respond'])
                    ->whereNumber('feedback')->name('feedback.respond');

                Route::apiResource('help-requests', AdminHelpRequestController::class)->names('help-requests');
                Route::patch('/help-requests/{helpRequest}/assign', [AdminHelpRequestController::class, 'assign'])
                    ->whereNumber('helpRequest')->name('help-requests.assign');

                Route::apiResource('documents', DocumentController::class)->names('documents');

                Route::apiResource('appeals', AdminAppealController::class)->names('appeals');
                Route::patch('/appeals/{appeal}/review', [AdminAppealController::class, 'review'])
                    ->whereNumber('appeal')->name('appeals.review');

                Route::apiResource('shelter-residencies', AdminShelterResidencyController::class)->names('shelter-residencies');
                Route::patch('/shelter-residencies/{residency}/checkout', [AdminShelterResidencyController::class, 'checkout'])
                    ->whereNumber('residency')->name('shelter-residencies.checkout');

                // Phase 4: User and login-audit administration.
                Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
                Route::get('/users/{user}', [AdminUserController::class, 'show'])->whereNumber('user')->name('users.show');
                Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
                Route::patch('/users/{user}', [AdminUserController::class, 'update'])->whereNumber('user')->name('users.update');
                Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->whereNumber('user')->name('users.destroy');
                Route::post('/users/{user}/restore', [AdminUserController::class, 'restore'])->whereNumber('user')->name('users.restore');
                Route::post('/users/{user}/assign-role', [AdminUserController::class, 'assignRole'])->whereNumber('user')->name('users.assignRole');

                Route::get('/login-audits', [AdminLoginAuditController::class, 'index'])->name('login-audits.index');
                Route::get('/login-audits/{audit}', [AdminLoginAuditController::class, 'show'])->whereNumber('audit')->name('login-audits.show');

                // Reports: Direct Joins and Aggregations matching ahp_joins_and_aggregations.sql
                Route::prefix('reports')->name('reports.')->group(function (): void {
                    Route::get('/summary', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'summary'])->name('summary');
                    Route::get('/area-severity', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'areaSeverityBreakdown'])->name('area-severity');
                    Route::get('/active-teams', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'activeRescueTeamAssignments'])->name('active-teams');
                    Route::get('/citizen-stats', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'citizenRequestStats'])->name('citizen-stats');
                    Route::get('/shelter-summary-view', [\App\Http\Controllers\Api\V1\Admin\AggregateReportController::class, 'shelterPublicSummary'])->name('shelter-summary-view');

                    Route::get('/inner-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'innerJoin'])->name('inner-join');
                    Route::get('/left-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'leftJoin'])->name('left-join');
                    Route::get('/right-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'rightJoin'])->name('right-join');
                    Route::get('/full-outer-join', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'fullOuterJoin'])->name('full-outer-join');
                    Route::get('/facility-locations', [\App\Http\Controllers\Api\V1\Admin\JoinReportController::class, 'facilityLocations'])->name('facility-locations');
                });
            });

        // TVUP Core Operations (Moved outside auth for easy frontend demo)
        Route::prefix('core')->name('core.')->group(function (): void {
            Route::get('/view', [\App\Http\Controllers\Api\V1\Admin\TVUPDisasterEmergencyController::class, 'getUserEmergencyHistory']);
            Route::get('/union', [\App\Http\Controllers\Api\V1\Admin\TVUPDisasterEmergencyController::class, 'getCriticalAlerts']);
            Route::post('/procedure', [\App\Http\Controllers\Api\V1\Admin\TVUPDisasterEmergencyController::class, 'escalateDisaster']);
            Route::post('/transaction', [\App\Http\Controllers\Api\V1\Admin\TVUPDisasterEmergencyController::class, 'reportDisasterAndEmergency']);
        });
    });
});

