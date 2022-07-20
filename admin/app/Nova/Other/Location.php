<?php

namespace App\Nova\Other;


use App\Nova\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Imumz\NovaMapCard\NovaMapCard;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use function __;

class Location extends Resource
{


    public function authorizedToDelete(Request $request)
    {
        return false;
    }

    public function authorizedToUpdate(Request $request)
    {
        return false;
    }
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Location::class;

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
            ID::make(__('ID'), 'id')->sortable(),

            Text::make('country', 'country', function ($country){
                return '<div class="flex flex-row items-center justify-start">
                <img width="30px" src="'.Storage::url($country['pathToFlag']).'" style="border-radius: 5%;width:32px; height: 32px; object-fit: cover ">
                <span class="ml-2">'.$country['name'].'</span>
                </div>';
            })->asHtml()->exceptOnForms()->sortable(),
            Text::make(__('cityName'), 'cityName')->sortable(),
            Text::make(__('Coordinates'), 'location', function ($location){
               return $location['coordinates'];
            })->onlyOnDetail(),

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
    protected static function applySearch($query, $search)
    {

        return $query->where('cityName', 'like', "%$search%");
    }
}
