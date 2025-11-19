<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
     public function store(StoreRoleRequest $request ){
        $role= Role::create($request->validated());
        return response()->json($role, 201);
}
    public function show (Request $request ,$id){
        $role=Role::findorfail($id);
        $role->users()->attach($request->user_id);
        return response()->json("attach sucssfull",200);

    }
}
