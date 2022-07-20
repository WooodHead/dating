<?php

namespace App\Nova;

use App\Models\User;
use App\Nova\Other\Language;
use App\Services\UserProfileService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Avatar;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use OptimistDigital\MultiselectField\Multiselect;

class Userprofile extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\Userprofile::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    public static function label() {
        return 'Users';
    }
    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
//        'id',
        'name',
    ];

    public static function usesScout()
    {
        return false;
    }

    public static $group = 'Main';

    /**
     * Get the fields displayed by the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function fields(Request $request)
    {
        $userProfileService = new UserProfileService();
        ini_set('xdebug.max_nesting_level', 10000);
        return [
            Select::make(__('Host'), 'user', function ($userId) {
                return \App\Models\User::find($userId)?->host;
            })->options((new UserService)->getAllHosts()),
            Avatar::make(__('avatar'), 'avatarPath')->disk('local'),
            Text::make(__('Name'), 'name')->sortable()->required(),
            ID::make(__('ID'), 'id')->sortable(),
            Boolean::make(__('Mail Status'), 'user', function ($userId) {
                return \App\Models\User::find($userId)?->isConfirmed;
            }),
            Date::make(__('Date added'), 'createdAt')->sortable(),

            Text::make('Email', 'user', function ($userId) {
                return \App\Models\User::find($userId)?->email;
            })->sortable()
                ->rules('required', 'email', 'max:254')
                ->creationRules('unique:users,email')
                ->updateRules('unique:users,email,{{resourceId}}'),

            Text::make(__('Account Status'), 'user', function ($userId) {
                return \App\Models\User::find($userId)?->isActive ?
                    "<span style='color:green'>Active</span>" :
                    "<span style='color:red'>Banned</span>";
            })->asHtml(),
            Date::make(__('DOB'), 'dob')->hideFromIndex(),
            Multiselect::make(__('Languages'), 'languages', function ($model) {
                $result = [];

                foreach ($model->languages as $language) {

                    $result[] = \App\Models\Language::find($language)?->name;
                }
                return implode(', ', $result);
            })
                ->asyncResource(Language::class)->onlyOnForms(),
            Text::make(__('Languages'), 'languages', function ($languages) {
                $result = [];
                \Log::debug($languages);
                if (!is_array($languages)) {
                    return '';
                }
                foreach ($languages as $language) {

                    $result[] = \App\Models\Language::find($language)?->name;
                }
                return implode(', ', $result);
            })->onlyOnDetail(),
            Select::make(__('Alcohol'), 'alcohol')->hideFromIndex()->options($userProfileService->alcoholOptions()),
            Select::make(__('Body type'), 'bodyType')->hideFromIndex()->options($userProfileService->bodyTypeOptions()),
            Select::make(__('Diet'), 'diet')->hideFromIndex()->options($userProfileService->dietOptions()),
            Select::make(__('Ethnic'), 'ethnic')->hideFromIndex()->options($userProfileService->ethnicOptions()),
            Select::make(__('Eyes'), 'eyes')->hideFromIndex()->options($userProfileService->eyesOptions()),
            Select::make(__('Gender'), 'gender')->hideFromIndex()->options($userProfileService->genderOptions()),
            Select::make(__('Hair'), 'hair')->hideFromIndex()->options($userProfileService->hairColorOptions()),
            Select::make(__('HairType'), 'hairType')->hideFromIndex()->options($userProfileService->hairTypeOptions()),
            Select::make(__('Nationality'), 'nationality', function ($nationalityId) {
                return \App\Models\Nationality::find($nationalityId)?->name;
            })->hideFromIndex(),
            Select::make(__('Profession'), 'professional')->hideFromIndex()->options($userProfileService->professionOptions()),
            Select::make(__('Smoker'), 'smoker')->hideFromIndex()->options($userProfileService->smokerOptions()),
            Select::make(__('Status'), 'status')->hideFromIndex()->options($userProfileService->statusOptions()),
            Number::make(__('Height'), 'height')->hideFromIndex()->rules(['int', 'min:100', 'max:250']),
            Number::make(__('Weight'), 'weight')->hideFromIndex()->rules(['int', 'min:10', 'max:250']),
            Textarea::make(__('bio'), 'bio')->hideFromIndex(),


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
        return [
            new Filters\Host,
        ];
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

    protected static function applySearch($query, $search)
    {
        $profileIds = User::query()->where('email', 'like', "%$search%")->pluck('profile')->toArray();

        return $query->where('name', 'like', "%$search%")
            ->orWhere('_id', 'like', "%$search%")
            ->orWhereIn('_id', $profileIds);
    }
}
