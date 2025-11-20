<?php

use App\Http\Controllers\PoperityController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\TypeRequestController;
use App\Http\Controllers\Userscontroller;
use App\Models\Poperity;
use App\Models\TypeRequest;
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

Route::get('/propertiesall', [PoperityController::class, 'index']);
Route::get('/propertiesall/{poperity}', [PoperityController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/properties', [PoperityController::class, 'indexnotapprove']);
Route::get('/properties/{poperity}', [PoperityController::class, 'shownotapprove']);
    Route::post('/properties', [PoperityController::class, 'store']);
    Route::put('/properties/{poperity}', [PoperityController::class, 'update']);
    Route::delete('/properties/{poperity}', [PoperityController::class, 'destroy']);
});
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {

    Route::post('/properties/{id}/approve', function (Request $request, $id) {
        $user = $request->user();

        
        
        return app(\App\Http\Controllers\PoperityController::class)
            ->approve($id);
    });

});




        
  Route::middleware('auth:sanctum')->group(function () {

Route::prefix('user')->group(function () {
    Route::delete('/requests/{id}/cancel', [RequestController::class, 'cancel']);

    Route::post('/requests', [RequestController::class, 'store']);

    
    Route::put('/requests/{id}/status', [RequestController::class, 'updateStatus']);
   
    Route::get('/requests', [RequestController::class, 'allRequests']);
}); 

Route::prefix('admin')->group(function () {

    Route::get('/requests', [RequestController::class, 'index']);
    
    Route::post('/requests/{id}/contract', [RequestController::class, 'uploadContract']);
});

});
