<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Report extends Model
{
    protected $dates = ['createdAt', 'updatedAt'];
}
