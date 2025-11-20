<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Investment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\InvestmentResource;

class InvestmentController extends Controller
{
    public function myShares(): JsonResponse
    {
        try {
            $user = Auth::user();
    
           
            $shares = Investment::with(['poperitys'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
    
            return response()->json([
                'success' => true,
                'shares' => InvestmentResource::collection($shares),
            ]);
    
        } catch (\Exception $e) {
            Log::error('Error fetching my shares: ' . $e->getMessage());
    
            return response()->json([
                'success' => false,
                'message' => 'Error fetching shares.'
            ], 500);
        }
    }
    
       public function allShares(): JsonResponse
       {
           try {
               $user = Auth::user();
       
               if (!$user->isAdmin()) {
                   return response()->json([
                       'success' => false,
                       'message' => 'Unauthorized'
                   ], 403);
               }
       
               $shares = Investment::with(['poperitys', 'user'])
                   ->latest()
                   ->get();
       
               return response()->json([
                   'success' => true,
                   'shares' => InvestmentResource::collection($shares),
                ]);
       
           } catch (\Exception $e) {
               Log::error('Error fetching all shares: ' . $e->getMessage());
               return response()->json(['success' => false], 500);
           }
       }
      
       public function show($id)
    {
        $investment = Investment::with(['poperitys', 'poperitys.user', 'user'])->find($id);

        if (!$investment) {
            return response()->json([
                'success' => false,
                'message' => 'Investment not found'
            ], 404);
        }

    
        if (Gate::denies('view', $investment)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new InvestmentResource($investment)
        ]);
    }

}
