<?php

namespace App\Providers;

use App\Models\AssistanceRequest;
use App\Models\MissingPersonReport;
use App\Models\NotificationPreference;
use App\Models\PrivacyPreference;
use App\Models\User;
use App\Policies\AssistanceRequestPolicy;
use App\Policies\MissingPersonReportPolicy;
use App\Policies\NotificationPreferencePolicy;
use App\Policies\PrivacyPreferencePolicy;
use App\Policies\ProfilePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(AssistanceRequest::class, AssistanceRequestPolicy::class);
        Gate::policy(MissingPersonReport::class, MissingPersonReportPolicy::class);
        Gate::policy(User::class, ProfilePolicy::class);
        Gate::policy(NotificationPreference::class, NotificationPreferencePolicy::class);
        Gate::policy(PrivacyPreference::class, PrivacyPreferencePolicy::class);

        // Session authorisation can't share the User policy with Profile
        // (Laravel only allows one policy per model), so define it as a
        // closure gate scoped to the `view-session` ability.
        Gate::define('view-session', function (User $actor, User $subject): bool {
            return $actor->id === $subject->id;
        });
    }
}