<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ApiRouteRegistrationTest extends TestCase
{
    public function test_expected_v1_api_routes_are_registered(): void
    {
        $expected = [
            'api.v1.health',
            'api.v1.auth.csrf',
            'api.v1.auth.register',
            'api.v1.auth.login',
            'api.v1.auth.me',
            'api.v1.auth.logout',
            'api.v1.citizen.requests.index',
            'api.v1.citizen.requests.store',
            'api.v1.citizen.requests.show',
            'api.v1.citizen.requests.update',
            'api.v1.citizen.requests.destroy',
            'api.v1.citizen.requests.cancel',
            'api.v1.citizen.missing-persons.index',
            'api.v1.citizen.missing-persons.store',
            'api.v1.citizen.missing-persons.show',
            'api.v1.citizen.missing-persons.photo',
            'api.v1.citizen.missing-persons.update',
            'api.v1.citizen.missing-persons.destroy',
            'api.v1.citizen.missing-persons.close',
        ];

        foreach ($expected as $name) {
            $this->assertTrue(Route::has($name), "Missing API route: {$name}");
        }
    }
}
