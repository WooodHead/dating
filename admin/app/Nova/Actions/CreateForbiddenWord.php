<?php

namespace App\Nova\Actions;

use App\Models\Forbiddenword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\ActionRequest;

class CreateForbiddenWord extends Action
{
    use InteractsWithQueue, Queueable;

    public $name = 'Add a word';
    public $confirmButtonText = 'Create';
    public $confirmText = 'Are you sure you want to add a word?';

    public function handleRequest(ActionRequest $request)
    {
        ini_set('xdebug.max_nesting_level', 10000);
        return Forbiddenword::create([
            'word' => $request->word,
        ]);
    }


    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields()
    {
        return [
//            Boolean::make(__('Active'), 'isActive')->sortable(),
            Text::make(__('word'), 'word')->sortable()->rules('required', 'string', 'min:2', 'unique:forbiddenwords,word'),
        ];
    }
}
