<?php

namespace App\Nova\Other;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use function __;

class Photo extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Photo::class;

    public static $group = 'Additional';

    public static $displayInNavigation = false;

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
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make(__('ID'), 'id')->exceptOnForms(),
            Text::make(__('Owner'), 'belongTo', function ($userId) {
                return $this->renderUserCell($userId);
            })->asHtml()->sortable(),
            Text::make(__('Album'), 'album', function ($albumId) {
                $name = \App\Models\Album::find($albumId)?->name;
                if(!$name) {
                    return '';
                }
                return '<a href="/admin/resources/albums/'.$albumId.'">'.$name.'</a>';
            })->asHtml()->sortable(),
            Text::make(__('Preview'),'photoPath', function ($path) {
                return $this->renderS3PhotoCell($path);
            })->asHtml()->onlyOnIndex(),
            Text::make(__('Preview'),'photoPath', function ($path) {
                return $this->renderS3PhotoCell($path, 5, 'lg');
            })->asHtml()->onlyOnDetail(),
            DateTime::make(__('Created At'), 'createdAt')->sortable(),
            DateTime::make(__('Updated At'), 'updatedAt')->sortable(),
        ];
    }



    /**
     * Get the cards available for the request.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
