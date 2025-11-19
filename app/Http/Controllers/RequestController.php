<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request as HttpRequest;
use App\Models\Request as RequestModel; 

use App\Models\Poperity;
use App\Http\Requests\StoreRequestRequest;

use App\Http\Resources\RequestResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class RequestController extends Controller
{


    public function store(StoreRequestRequest $request): JsonResponse
    {
        try {
    
            $user = Auth::user();
    
           
            $property = Poperity::with('typeRequest')->find($request->prp_id);
    
            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Property not found'
                ], 404);
            }
    
         
            if ($property->typeRequest && $property->typeRequest->name === 'fullSell') {
                $rate = 100; 
            } else {
                $rate = $request->rate; 
            }
    
           
            $submittedRequest = RequestModel::create([
                'user_id' => $user->id,
                'prp_id' => $request->prp_id,
                'submission_date' => now()->toDateString(),
                'rate' => $rate, 
                'description' => $request->description,
                'status' => 'pending',
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Request submitted successfully',
                'data' => new RequestResource($submittedRequest)
            ], 201);
    
        } catch (\Exception $e) {
            Log::error('Request submission error: ' . $e->getMessage());
    
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'Rate is required for partial sale properties.'
                ], 400);
            }
        
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
      public function allRequests(): JsonResponse
    {
        try {
            $user = Auth::user();
    
            $sentRequests = RequestModel::with(['poperity'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
    
            
            $propertyIds = Poperity::where('user_id', $user->id)->pluck('id');
            $receivedRequests = RequestModel::with(['poperity', 'user'])
                ->whereIn('prp_id', $propertyIds)
                ->latest()
                ->get();
            
            return response()->json([
                'success' => true,
                'sent_requests' => RequestResource::collection($sentRequests),
                'received_requests' => RequestResource::collection($receivedRequests)
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching all requests: ' . $e->getMessage());
    
            return response()->json([
                'success' => false,
                'message' => 'Error fetching all requests.'
            ], 500);
        }
    }
    
   public function updateStatus(HttpRequest  $request ,$id):JsonResponse
   {
    try{
        $user = Auth::user();
        $requestItem= RequestModel::with('poperity')->find($id);
        if(!$requestItem){
            return response()->json([
                'success'=>false,
                'message'=>'Request not found'
            ],404);
        }
        if (Gate::denies('updateStatus', $requestItem)) {
            return response()->json([
                'success' => false, 
                'message' => 'Unauthorized'
            ], 403);
        }
        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);
        $requestItem->update(['status' => $request->status]);
        return response()->json([
            'success' => true,
            'message' => "Request {$request->status} successfully",
            'data' => new RequestResource($requestItem)
        ]);

    }
    catch (\Exception $e) {
        Log::error('Error updating request status: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Error updating request status.'
        ], 500);
    }
   }
   public function uploadContract(HttpRequest  $request, $id): JsonResponse
   {
       try {
           $requestItem = RequestModel::find($id);

           if (!$requestItem) {
               return response()->json([
                'success' => false,
                 'message' => 'Request not found'
                ], 404);
           }

         
           if (Gate::denies('uploadContract', $requestItem)) {
               return response()->json([
                'success' => false, 
                'message' => 'Unauthorized'
            ], 403);
           }
           if ($requestItem->status !== 'accepted') {
            return response()->json([
                'success' => false,
                'message' => 'Contract can only be uploaded for accepted requests.'
            ], 403);}
           $request->validate([
               'contract' => 'required|image|mimes:jpg,jpeg,png|max:5120'
           ]);

           $path = $request->file('contract')->store('contracts', 'public');

           $requestItem->update(['contract' => $path]);

           return response()->json([
               'success' => true,
               'message' => 'Contract uploaded successfully',
               'contract_url' => asset('storage/' . $path)
           ]);
       } catch (\Exception $e) {
           Log::error('Error uploading contract: ' . $e->getMessage());

           return response()->json([
               'success' => false,
               'message' => $e->getMessage() 
           ], 500);
       }
   }
   public function index(): JsonResponse
   {

       try {
           $user = Auth::user();

           if (Gate::denies('viewAny', RequestModel::class)) {
               return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
           }

           $requests =RequestModel::with(['poperity', 'user'])
               ->latest()
               ->get();

           return response()->json([
               'success' => true,
               'data' => RequestResource::collection($requests)
           ]);
       } 
       catch (\Exception $e) {
           Log::error('Error fetching all requests: ' . $e->getMessage());

           return response()->json([
               'success' => false,
               'message' => 'Error fetching all requests.'
           ], 500);
       }
    }

    public function cancel($id): JsonResponse
    {
        try {
            $user = Auth::user();
            $requestItem = RequestModel::find($id);

            if (!$requestItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }

        
            if (Gate::denies('cancel', $requestItem)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized or cannot cancel this request.'
                ], 403);
            }

            
            $requestItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Request canceled successfully.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error canceling request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error canceling request.'
            ], 500);
        }
    }


}
