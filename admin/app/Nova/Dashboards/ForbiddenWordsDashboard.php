<?php

namespace App\Nova\Dashboards;

use App\Nova\Actions\CreateForbiddenWord;
use Card\ForbiddenWordsCard\ForbiddenWordsCard;
use Laravel\Nova\Dashboard;

class ForbiddenWordsDashboard extends Dashboard
{
    /**
     * Get the cards for the dashboard.
     *
     * @return array
     */
    public function cards()
    {
        return [
            (new ForbiddenWordsCard)->words(),
        ];
    }




    /**
     * Get the URI key for the dashboard.
     *
     * @return string
     */
    public static function uriKey()
    {
        return 'forbidden-words-dashboard';
    }
}
