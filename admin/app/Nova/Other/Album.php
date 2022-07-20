<?php

namespace App\Nova\Other;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Stack;
use Laravel\Nova\Fields\Text;
use function __;

class Album extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Album::class;

    public static $group = 'Additional';
    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make(__('ID'), 'id')->exceptOnForms(),
            Text::make(__('Owner'), 'belongTo', function ($userId){
                return $this->renderUserCell($userId);
            })->asHtml()->sortable(),
            Text::make(__('Name'), 'name'),
            Select::make(__('Type'), 'type')->options(['private', 'public']),
            Text::make(__('Photos'), 'photos')->resolveUsing(function (){
                $photos = [];
                foreach ($this->resource->photos as $photo) {
                    $photos[] = $this->renderS3PhotoCell(\App\Models\Photo::find($photo)?->photoPath, 5, 'lg');
                }
                return implode('', $photos);
            })->onlyOnDetail()->asHtml(),

            DateTime::make(__('Created At'), 'createdAt')->sortable(),
            DateTime::make(__('Updated At'), 'updatedAt')->sortable(),

        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
