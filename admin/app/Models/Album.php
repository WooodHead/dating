<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Album extends Model
{
    protected $dates = ['createdAt', 'updatedAt'];
}
