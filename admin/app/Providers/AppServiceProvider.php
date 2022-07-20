<?php

namespace App\Providers;

use App\Models\Forbiddenword;
use App\Observers\ForbiddenWordObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
//        Forbiddenword::observe(ForbiddenWordObserver::class);
    }
}
