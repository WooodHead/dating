<?php

namespace App\Models;
use Jenssegers\Mongodb\Eloquent\Model;

class Forbiddenword extends Model
{
    protected $fillable = ['isActive', 'word'];
}
