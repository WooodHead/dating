<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class UserService
{
    public function getAllHosts(): array
    {
        $hosts = [];
        foreach (DB::table('users')->distinct()->select('host')->get() as $host) {
            $hosts[$host] = $host;
        }
        return $hosts;
    }
}
