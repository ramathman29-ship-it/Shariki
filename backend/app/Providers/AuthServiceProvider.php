<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
   protected $policies = [
    \App\Models\Poperity::class => \App\Policies\PoperityPolicy::class,
    \App\Models\Request::class=>\App\Policies\RequestPolicy::class,
    \App\Models\Investment::class => \App\Policies\InvestmentPolicy::class,

];


    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
