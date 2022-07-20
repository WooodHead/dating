<?php

namespace App\Nova\Filters;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Laravel\Nova\Filters\Filter;

class Host extends Filter
{

    /**
     * The filter's component.
     *
     * @var string
     */
    public $component = 'select-filter';

    /**
     * Apply the filter to the given query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply(Request $request, $query, $value)
    {

        $profileIds = User::query()->where('host', 'like', "%$value%")->pluck('profile')->toArray();
        return  $query->whereIn('_id', $profileIds);
    }

    /**
     * Get the filter's available options.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function options(Request $request)
    {
        return (new UserService)->getAllHosts();
    }
}
