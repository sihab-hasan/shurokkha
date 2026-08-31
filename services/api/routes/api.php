<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Citizen\AssistanceRequestController;
use App\Http\Controllers\Api\V1\Citizen\MissingPersonReportController;
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
        });

        Route::prefix('citizen')->name('citizen.')->middleware(['auth', 'role:citizen'])->group(function (): void {
            Route::get('/requests', [AssistanceRequestController::class, 'index'])->name('requests.index');
            Route::post('/requests', [AssistanceRequestController::class, 'store'])->name('requests.store');
            Route::get('/requests/{assistanceRequest}', [AssistanceRequestController::class, 'show'])->name('requests.show');
            Route::patch('/requests/{assistanceRequest}', [AssistanceRequestController::class, 'update'])->name('requests.update');
            Route::delete('/requests/{assistanceRequest}', [AssistanceRequestController::class, 'destroy'])->name('requests.destroy');
            Route::post('/requests/{assistanceRequest}/cancel', [AssistanceRequestController::class, 'cancel'])->name('requests.cancel');

            Route::get('/missing-persons', [MissingPersonReportController::class, 'index'])->name('missing-persons.index');
            Route::post('/missing-persons', [MissingPersonReportController::class, 'store'])->name('missing-persons.store');
            Route::get('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'show'])->name('missing-persons.show');
            Route::get('/missing-persons/{missingPersonReport}/photo', [MissingPersonReportController::class, 'photo'])->name('missing-persons.photo');
            Route::patch('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'update'])->name('missing-persons.update');
            Route::delete('/missing-persons/{missingPersonReport}', [MissingPersonReportController::class, 'destroy'])->name('missing-persons.destroy');
            Route::post('/missing-persons/{missingPersonReport}/close', [MissingPersonReportController::class, 'close'])->name('missing-persons.close');
        });

        Route::prefix('admin')->name('admin.')->group(function (): void {
            Route::get('/disasters', [\App\Http\Controllers\Api\V1\Admin\DisasterController::class, 'index'])->name('disasters.index');

            Route::get('/affected-areas', [\App\Http\Controllers\Api\V1\Admin\AffectedAreaController::class, 'index'])->name('affected-areas.index');
            Route::post('/affected-areas', [\App\Http\Controllers\Api\V1\Admin\AffectedAreaController::class, 'store'])->name('affected-areas.store');
            Route::delete('/affected-areas/{affectedArea}', [\App\Http\Controllers\Api\V1\Admin\AffectedAreaController::class, 'destroy'])->name('affected-areas.destroy');

            Route::get('/rescue-teams', [\App\Http\Controllers\Api\V1\Admin\RescueTeamController::class, 'index'])->name('rescue-teams.index');
            Route::post('/rescue-teams', [\App\Http\Controllers\Api\V1\Admin\RescueTeamController::class, 'store'])->name('rescue-teams.store');
            Route::delete('/rescue-teams/{rescueTeam}', [\App\Http\Controllers\Api\V1\Admin\RescueTeamController::class, 'destroy'])->name('rescue-teams.destroy');

            Route::get('/assignments', [\App\Http\Controllers\Api\V1\Admin\TeamManagementController::class, 'index'])->name('assignments.index');
            Route::post('/assignments', [\App\Http\Controllers\Api\V1\Admin\TeamManagementController::class, 'store'])->name('assignments.store');
            Route::patch('/assignments/{assignment}/status', [\App\Http\Controllers\Api\V1\Admin\TeamManagementController::class, 'updateStatus'])->name('assignments.updateStatus');
            Route::delete('/assignments/{assignment}', [\App\Http\Controllers\Api\V1\Admin\TeamManagementController::class, 'destroy'])->name('assignments.destroy');
        });
    });
});
