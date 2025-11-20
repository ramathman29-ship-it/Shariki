<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;


class Userscontroller extends Controller
{
 public function register(StoreUserRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'personal_id' => $validated['personal_id'],
                'gender' => $validated['gender'],
                'birthday' => $validated['birthday'],
                'mobile1' => $validated['mobile1'],
                'nationality' => $validated['nationality'],
                'job' => $validated['job'],
                'residency' => $validated['residency'],
                'budget' => $validated['budget'],
                'verified_id' => '',
                'budget_verif' => ''
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => [
                    'id_user' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



public function login(StoreLoginRequest $request)
{
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid email or password'
        ], 401);
    }
    if($user->email !== 'admin@example.com') {

    $token = $user->createToken('token')->plainTextToken;

    return response()->json([
        'message' => 'Welcome',
        'UserName' => $user->name,
        'User' => $user,
        'Token' => $token
    ], 200);
}
$token = $user->createToken('admin-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);

}

public function logout(Request $request){
    $request->user()->currentAccessToken()->delete();
return response()->json([
    'message' => 'logout' , 200]);
} 

}


