<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suffixe extends Model
{
     protected $guarded=[''];
  
public function poperitys(){
 return $this->belongsTo(Poperity::class);
}
}
