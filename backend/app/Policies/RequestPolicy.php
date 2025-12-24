<?php

namespace App\Policies;

use App\Models\Request;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestPolicy
{
      /**
     * Determine whether the user can view any models.
     */


     
    
    public function view(User $user, Request $request): bool
    {
    
        return $user->id === $request->user_id
            || $user->id === $request->poperitys->user_id
            || $user->isAdmin();
    }
    public function updateStatus(User $user, Request $request): bool
    {
        return $user->id === $request->poperitys->user_id;
    }
    public function uploadContract(User $user ,Request $request):bool{
        return $user->isAdmin();
    }
    public function cancel(User $user, Request $request): bool
    {
        return $user->id === $request->user_id && $request->status === 'pending';
    }
    public function viewAny(User $user): bool
{
   
    return $user->isAdmin();
}

}
