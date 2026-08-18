<?php

namespace App\Providers;

use App\Models\AssistanceRequest;
use App\Models\MissingPersonReport;
use App\Policies\AssistanceRequestPolicy;
use App\Policies\MissingPersonReportPolicy;
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
    }
}
