<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $guarded=[''];
    public function request() { 
        return $this->belongsTo(Request::class); }

}
