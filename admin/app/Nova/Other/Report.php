<?php

namespace App\Nova\Other;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use function __;

class Report extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Report::class;

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
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make(__('ID'), 'id')->exceptOnForms(),
            Text::make(__('Complainer'), 'reports', function ($reports) {
                $result  = [];
                foreach ($reports as $report) {
                    $result[] = $this->renderUserCell($report['complainerId']);
                }
                return implode('<br>', $result);
            })->asHtml()->sortable(),
            Text::make(__('Reasons'), 'reports', function ($reports) {
                $result  = [];
                foreach ($reports as $report) {
                    $result[] = $report['reason'];
                }
                return implode('<br>', $result);
            })->asHtml()->sortable(),
            Text::make(__('User'), 'user', function ($userId) {
                return $this->renderUserCell($userId);
            })->asHtml()->sortable(),
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
