<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Poperity extends Model
{
    use HasFactory;
    protected $guarded = [''];
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
        return $this->hasMany(Suffixe::class, 'pop_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function updateStatus()
    {
        if ($this->available_percentage <= 0) {
            $this->status = 'done';
        } elseif ($this->is_approved) {
            $this->status = 'view';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }
}
