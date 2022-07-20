<?php

namespace App\Nova;

use App\Models\Country;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Resource as NovaResource;

abstract class Resource extends NovaResource
{
    /**
     * Build an "index" query for the given resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function indexQuery(NovaRequest $request, $query)
    {
        return $query;
    }

    /**
     * Build a Scout search query for the given resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Laravel\Scout\Builder  $query
     * @return \Laravel\Scout\Builder
     */
    public static function scoutQuery(NovaRequest $request, $query)
    {
        return $query;
    }





    /**
     * Build a "detail" query for the given resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function detailQuery(NovaRequest $request, $query)
    {
        return parent::detailQuery($request, $query);
    }

    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function relatableQuery(NovaRequest $request, $query)
    {
        return parent::relatableQuery($request, $query);
    }

    public function renderUserCell($userId)
    {
        $user = User::find($userId);
        if(!$user) {
            return '';
        }
        $profile= \App\Models\Userprofile::find($user->profile);
        if(!$profile ) {
            return '';
        }
        return '<div class="flex flex-row items-center justify-start">
                        <img src="'.($profile->avatarPath??'').'" style="border-radius: 40%;width:32px; height: 32px; object-fit: cover ">
                        <span class="ml-2">'.$profile->name.'</span>
                </div>';
    }

    public function renderCounrtyCell($countryId)
    {
        $country = Country::find($countryId);
        if(!$country) {
            return '';
        }
        return '<div class="flex flex-row items-center justify-start">
                        <img src="'.($country->filePath??'').'" style="border-radius: 40%;width:32px; height: 32px; object-fit: cover ">
                        <span class="ml-2">'.$country->name.'</span>
                </div>';
    }

    public function renderS3PhotoCell(string $path, int $periodInMinutes = 5, string $photoSize = 'sm'): string
    {
        $additionalStyles = '';
        switch ($photoSize) {
            case 'lg':
                $additionalStyles = ' width:50%; height:auto';
                break;
            case 'md':
                $additionalStyles = ' width:30%; height:auto';
                break;
        }

        return '<img src="'.$this->createS3Url($path, $periodInMinutes, $photoSize).'" class="align-bottom w-8 h-8 rounded" style="object-fit: cover; '.$additionalStyles.'">';
    }

    private function prepareS3Path(string $path, string $photoSize='sm'): string
    {
        $pathinfo = pathinfo($path);

        return Str::substr(
            Str::replace(  //replacing path for S3
                env('AWS_BUCKET'),
                env('AWS_WORK_DIR'),
                $pathinfo['dirname'] . '/' . $photoSize . '-' . $pathinfo['basename']
            ),
            1
        );
    }

    private function createS3Url(string $path, int $periodInMinutes=5, $photoSize='sm'):string
    {
        return Storage::disk('s3')->temporaryUrl(
            $this->prepareS3Path($path, $photoSize),
            Carbon::now()->addMinutes($periodInMinutes)
        );
    }
}
