<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\Userscontroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RequestController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('register', [Userscontroller::class, 'register']); 
Route::post('role',[RoleController::class,'store']);
Route::get('role/{id}/user',[RoleController::class,'show']);

Route::post('login',[Userscontroller::class,'login']);
Route::get('logout',[Userscontroller::class,'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {

Route::prefix('user')->group(function () {
    Route::delete('/requests/{id}/cancel', [RequestController::class, 'cancel']);

    Route::post('/requests', [RequestController::class, 'store']);
   
    Route::get('/requests', [RequestController::class, 'allRequests']);
}); 
Route::prefix('investor')->group(function () {
    
    Route::get('/requests', [RequestController::class, 'receivedRequests']);
    
    Route::put('/requests/{id}/status', [RequestController::class, 'updateStatus']);
});
Route::prefix('admin')->group(function () {

    Route::get('/requests', [RequestController::class, 'index']);
    
    Route::post('/requests/{id}/contract', [RequestController::class, 'uploadContract']);
});

});
