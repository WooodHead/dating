<?php

namespace App\Observers;

use App\Models\Forbiddenword;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Nova;

class ForbiddenWordObserver
{
    public function creating(Forbiddenword $forbiddenWord)
    {
        Nova::whenServing(function (NovaRequest $request) use ($forbiddenWord) {
            \Log::debug('forbiddenWord is being created');
//            return Forbiddenword::create([
//                'isActive' => $request->isActive,
//                'word' => $request->word,
//            ]);

        });
    }
}
