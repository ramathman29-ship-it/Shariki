<?php

use App\Http\Controllers\PoperityController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\Userscontroller;
use App\Models\Poperity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('register', [Userscontroller::class, 'register']); 
Route::post('role',[RoleController::class,'store']);
Route::get('role/{id}/user',[RoleController::class,'show']);
Route::post('register',[Userscontroller::class,'register']);
Route::post('login',[Userscontroller::class,'login']);
Route::get('logout',[Userscontroller::class,'logout'])->middleware('auth:sanctum');
Route::post('poperitystore',[PoperityController::class,"store"]);
Route::get('poperityshow/{id}',[PoperityController::class,"show"]);
Route::get('poperityview',[PoperityController::class,"index"]);