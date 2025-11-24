<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends  Authenticatable
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
   public function roles()
{
    return $this->belongsToMany(Role::class, 'userroles', 'user_id', 'role_id');
}

public function isAdmin(): bool
    {
        // إذا العلاقة غير محمّلة فحمّلها الآن (يحمي من null)
        $this->loadMissing('roles');

        // تأكد من أن $this->roles ليس null وأنه Collection
        if (! $this->roles) {
            return false;
        }

        return $this->roles
            ->pluck('name')                           // عمود اسم الدور في جدول roles
            ->map(fn($name) => strtolower(trim($name)))
            ->contains('admin');
    }
}