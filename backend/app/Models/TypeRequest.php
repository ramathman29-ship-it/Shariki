<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class TypeRequest extends Model
{
  use HasFactory;
    protected $guarded=[''];

    public function poperity(){
  return $this->hasMany(Poperity::class, 'RT_id', 'id');
}
}
