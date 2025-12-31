<?php

use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PoperityController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\TypeRequestController;
use App\Http\Controllers\Userscontroller;
use App\Models\Poperity;
use App\Models\TypeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ReportController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('register', [Userscontroller::class, 'register']);
Route::post('role', [RoleController::class, 'store']);
Route::get('role/{id}/user', [RoleController::class, 'show']);
Route::post('register', [Userscontroller::class, 'register']);
Route::post('login', [Userscontroller::class, 'login']);
Route::get('/propertiesall', [PoperityController::class, 'index']);
Route::get('/propertiesall/{poperity}', [PoperityController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/properties', [PoperityController::class, 'indexnotapprove']);
    Route::get('/properties/{poperity}', [PoperityController::class, 'shownotapprove']);
    Route::post('/properties', [PoperityController::class, 'store']);
    Route::put('/properties/{poperity}', [PoperityController::class, 'update']);
    Route::delete('/properties/{poperity}', [PoperityController::class, 'destroy']);
    Route::get('logout',[Userscontroller::class,'logout']);
Route::get('/propertiesforuser',[PoperityController::class, 'indexUser']);
Route::get('/propertyforuser/{poperity}',[PoperityController::class, 'showUser']);
Route::post('/pay', [PaymentController::class, 'createPayment']);
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
        Route::get('profile', [Userscontroller::class, 'profile']);

        Route::post('/requests', [RequestController::class, 'store']);


        Route::put('/requests/{id}/status', [RequestController::class, 'updateStatus']);

        Route::get('/requests', [RequestController::class, 'allRequests']);
        Route::get('/requests/{id}', [RequestController::class, 'show']);
        Route::get('/myShares', [InvestmentController::class, 'myShares']);
        Route::get('/myShares/{id}', [InvestmentController::class, 'show']);
        Route::get('/notifications', [NotificationsController::class, 'getNotifications']);
    });
        Route::get('/investments/{id}/contract', [InvestmentController::class, 'getContract']);


    Route::prefix('admin')->group(function () {

        Route::get('/requests', [RequestController::class, 'index']);
        Route::get('/requests/{id}', [RequestController::class, 'show']);
        Route::post('/requests/{id}/contract', [RequestController::class, 'uploadContract']);
        Route::get('/allShares', [InvestmentController::class, 'allShares']);
    });
});
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/notifications', [NotificationsController::class, 'getNotifications']);
   });
   Route::middleware('auth:sanctum')->group(function () {
    
    Route::prefix('admin/reports')->group(function () {
        Route::post('/daily', [ReportController::class, 'generateDailyReport']);
        Route::post('/monthly', [ReportController::class, 'generateMonthlyReport']);
        
    });
});
