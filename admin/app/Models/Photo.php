<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Photo extends Model
{
    protected $dates = ['createdAt', 'updatedAt'];
}
