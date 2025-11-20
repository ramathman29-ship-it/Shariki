<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
     protected $guarded=[''];

     public function user(){
 return $this->belongsTo(User::class);

}
 public function poperitys(){
 return $this->belongsTo(Poperity::class);
}
}
