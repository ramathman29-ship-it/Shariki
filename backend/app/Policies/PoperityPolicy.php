<?php

namespace App\Policies;

use App\Models\Poperity;
use App\Models\User;

class PoperityPolicy
{
    /**
     * السماح لأي شخص برؤية قائمة العقارات
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * السماح لأي شخص برؤية عقار معين
     */
    public function view(?User $user, Poperity $property)
    {
        return true;
    }

    /**
     * التعديل فقط للمالك الأصلي إذا لم يتم بيع أي نسبة
     */
    public function update(User $user, Poperity $property)
    {
        return $property->user_id === $user->id
            && $property->available_percentage == 100;
    }

    /**
     * الحذف فقط للمالك الأصلي إذا لم يتم بيع أي نسبة
     */
    public function delete(User $user, Poperity $property)
    {
        return $property->user_id === $user->id
            && $property->available_percentage == 100;
    }

    /**
     * إنشاء العقار مسموح لأي مستخدم مسجل
     */
    public function create(User $user)
    {
        return true;
    }
    public function approve(User $user)
{
    return $user->roles
        ->pluck('name')
        ->map(fn($name) => strtolower(trim($name)))
        ->contains('admin');
}

}
