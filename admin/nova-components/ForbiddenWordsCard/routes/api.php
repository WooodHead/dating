<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Card API Routes
|--------------------------------------------------------------------------
|
| Here is where you may register API routes for your card. These routes
| are loaded by the ServiceProvider of your card. You're free to add
| as many additional routes to this file as your card may require.
|
*/

 Route::post('/is-active/{forbiddenword}', function (Request $request, \App\Models\Forbiddenword $forbiddenword) {
     \Log::debug('is-active route called');
     \Log::debug($request);
     return response()->json([
         'status' => $forbiddenword->update(['isActive' => $request->isActive])
         ]);
 });
