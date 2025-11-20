<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Poperity extends Model
{
     protected $guarded=[''];
    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function typeRequest()
    {
        return $this->belongsTo(TypeRequest::class, 'RT_id', 'id');
    }

    public function photos()
    {
        return $this->hasMany(Image::class);
    }

    public function suffixes()
    {
        return $this->hasMany(Suffixe::class , 'pop_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}