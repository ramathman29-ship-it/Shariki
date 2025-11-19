<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
     protected $guarded=[''];
     public function users()
     {
         return $this->belongsToMany(User::class, 'userroles', 'role_id', 'id_user');
     }
     

}
