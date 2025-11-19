<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;


    // اسم الجدول في قاعدة البيانات
    protected $table = 'users';


    // الحقول القابلة للكتابة
    protected $fillable = [
        'name',
        'email',
        'password',
        'personal_id',
        'gender',
        'birthday',
        'mobile1',
        'nationality',
        'job',
        'residency',
        'budget',
        'verified_id',
        'budget_verif'
    ];

    // الحقول المخفية
    protected $hidden = [
        'password',
        'remember_token',
    ];
     public function roles(){
 return $this->BelongsToMany(Role::class,'userroles');
}
public function request(){
 return $this->hasMany(Request::class);
}
 public function poperity(){
 return $this->hasMany(Poperity::class);
}
}
