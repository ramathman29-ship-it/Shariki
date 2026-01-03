<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request as HttpRequest;
use App\Models\Request as RequestModel;

use App\Models\Poperity;
use App\Http\Requests\StoreRequestRequest;
use App\Models\Investment;
use App\Http\Resources\RequestResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Notifications\GenericNotification;
use Illuminate\Support\Facades\Notification;
use App\Enums\NotificationType;

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
            } else if ($property->typeRequest && $property->typeRequest->name === 'partialSell') {
                $rate = $request->rate;
                if ($rate > $property->available_percentage) {
                    return response()->json([
                        'success' => false,
                        'message' => 'the request rate is greater than the available percentage'
                    ], 400);
                }
            }


            $submittedRequest = RequestModel::create([
                'user_id' => $user->id,
                'prp_id' => $request->prp_id,
                'submission_date' => now()->toDateString(),
                'rate' => $rate,
                'description' => $request->description,
                'status' => 'pending',
            ]);
            $propertyOwner = $property->user;
            if ($propertyOwner && $propertyOwner->id !== $user->id) {
                $url = "/user/requests/{$submittedRequest->id}";
                $propertyOwner->notify(new GenericNotification(
                    "You have a new request for your property",
                    $url,
                    NotificationType::NEW_REQUEST
                ));
            }

            return response()->json([
                'success' => true,
                'message' => 'Request submitted successfully',
                'data' => new RequestResource($submittedRequest)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Request submission error: ' . $e->getMessage());



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

            $sentRequests = RequestModel::with(['poperitys', 'poperitys.user'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();


            $propertyIds = Poperity::where('user_id', $user->id)->pluck('id');
            $receivedRequests = RequestModel::with(['poperitys', 'poperitys.user', 'user'])
                ->whereIn('prp_id', $propertyIds)
                ->whereNotIn('status', ['done', 'rejected'])
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

    public function updateStatus(HttpRequest  $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $requestItem = RequestModel::with('poperitys')->find($id);
            if (!$requestItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }
            if (Gate::denies('updateStatus', $requestItem)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            if ($requestItem->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Request status cannot be updated unless it is pending.'
                ], 400);
            }
            $request->validate([
                'status' => 'required|in:accepted,rejected'
            ]);

            $requestItem->update(['status' => $request->status]);
         
            $requestUser = $requestItem->user;
            $requestUser = $requestItem->user;
            $url = "/user/requests/{$requestItem->id}";
            $requestUser->notify(new GenericNotification(
                "Your request has been {$request->status}",
                $url,
                $request->status === 'accepted' ? NotificationType::REQUEST_ACCEPTED : NotificationType::REQUEST_REJECTED
            ));

            return response()->json([
                'success' => true,
                'message' => "Request {$request->status} successfully",
                'data' => new RequestResource($requestItem)
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating request status: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error updating request status.'
            ], 500);
        }
    }
   public function payment_card(HttpRequest $request, $id)
{
    $user = Auth::user();
    $requestItem = RequestModel::with('poperitys')->find($id);

    if (!$requestItem) {
        return response()->json([
            'success' => false,
            'message' => 'Request not found'
        ], 404);
    }

    if ($requestItem->status === 'accepted') {
        PaymentController::authorizePayment($requestItem);
        return response()->json([
            'success' => true,
            'message' => 'Payment authorized successfully'
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Request is not accepted yet'
    ], 400);
}

    public function uploadContract(HttpRequest  $request, $id): JsonResponse
    {
        try {
            $requestItem = RequestModel::with('poperitys.typeRequest')->find($id);
            $property = $requestItem->poperitys;
            $buyer = $requestItem->user;
            $propertyOwner = $property->user;
            $user = Auth::user();
            if (!$requestItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request not found'
                ], 404);
            }

            if ($requestItem->rate > $property->available_percentage) {
                $requestItem->update(['status' => 'rejected']);
                return response()->json([
                    'success' => false,
                    'message' => 'available percentage less than rate'
                ], 403);
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
                ], 403);
            }
            $request->validate([
                'contract' => 'required|image|mimes:jpg,jpeg,png|max:5120'
            ]);

            $path = $request->file('contract')->store('contracts', 'public');

            $requestItem->update(['contract' => $path]);
  

            $property->available_percentage -= $requestItem->rate;
            if ($property->available_percentage == 0) {
                if ($property->typeRequest->name === 'partialSell') {
                    $property->typeRequest->update([
                        'name' => 'Rent'
                    ]);
                    $property->update([
                        'user_id' => 1,
                        'available_percentage' => 100
                    ]);
                } else if ($property->typeRequest->name === 'fullSell') {
                    $property->typeRequest->update([
                        'name' => 'Done'
                    ]);
                }
            }
            $property->save();
            $otherRequests = RequestModel::where('prp_id', $property->id)
                ->where('id', '!=', $requestItem->id)
                ->whereIn('status', ['pending', 'accepted'])
                ->get();

            foreach ($otherRequests as $req) {
                if ($req->rate > $property->available_percentage) {
                    $req->update(['status' => 'rejected']);
                }
            }
            if ($requestItem->rate == 100) {
                $property->update(['user_id' => $requestItem->user_id]);
            } else {
                Investment::create([
                    'user_id'   => $requestItem->user_id,
                    'prp_id'    => $requestItem->prp_id,
                    'rate'      => $requestItem->rate,
                    'contract'  => $path,
                    'submission_date' => now()->toDateString(),
                ]);
            }

            $requestItem->delete();

            $buyer->notify(new GenericNotification(
                "The contract has been uploaded successfully",
                "/contracts/{$requestItem->id}",
                NotificationType::CONTRACT_UPLOADED
            ));


            if ($propertyOwner && $propertyOwner->id !== $buyer->id) {
                $propertyOwner->notify(new GenericNotification(
                    "A contract has been uploaded for your property",
                    "/propertiesforuser",
                    NotificationType::CONTRACT_UPLOADED
                ));
            }
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
    public function transfer(){
        
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
            $requests = RequestModel::with(['poperitys', 'user'])
                ->where('status', 'accepted')
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => RequestResource::collection($requests)
            ]);
        } catch (\Exception $e) {
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

    public function show($id)
    {
        $requestItem = RequestModel::with(['poperitys', 'poperitys.user', 'user'])->find($id);

        if (!$requestItem) {
            return response()->json([
                'success' => false,
                'message' => 'Request not found'
            ], 404);
        }


        if (Gate::denies('view', $requestItem)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new RequestResource($requestItem)
        ]);
    }
}
