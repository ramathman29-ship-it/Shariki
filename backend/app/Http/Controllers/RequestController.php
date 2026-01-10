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
use App\Http\Resources\MyShareResource;
use App\Models\TypeRequest;
use App\Models\User;

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
                $url = "/user/requests";
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
                ->whereNot('status', 'investment')
                ->latest()
                ->get();


            $propertyIds = Poperity::where('user_id', $user->id)->pluck('id');
            $receivedRequests = RequestModel::with(['poperitys', 'poperitys.user', 'user'])
                ->whereIn('prp_id', $propertyIds)
                ->whereNotIn('status', ['done', 'rejected', 'investment'])
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

        if ($requestItem->status !== 'accepted') {
            return response()->json([
                'success' => false,
                'message' => 'Request is not accepted yet'
            ], 400);
        }

        // التحقق إذا تم الاحتجاز مسبقًا
        if ($requestItem->payment_status === 'held') {
            return response()->json([
                'success' => false,
                'message' => 'Payment has already been held'
            ], 400);
        }

        // تنفيذ الاحتجاز لأول مرة
        PaymentController::authorizePayment($requestItem);

        // تحديث الحالة بعد الاحتجاز
        $requestItem->payment_status = 'held';
        $requestItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment held successfully'
        ]);
    }


    public function uploadContract(HttpRequest $request, $id): JsonResponse
    {
        try {
            $requestItem = RequestModel::with('poperitys.typeRequest')->find($id);
            $property = $requestItem->poperitys;
            $buyer = $requestItem->user;
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
                    'message' => 'Available percentage less than rate'
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

            // تحديث نسبة العقار
            $property->available_percentage -= $requestItem->rate;
            $property->save();
            $property->updateStatus();

            // تنفيذ الاحتجاز أو الدفع النهائي
            PaymentController::capturePayment($requestItem);

            // رفض الطلبات الأخرى التي تجاوزت النسبة المتبقية
            $otherRequests = RequestModel::where('prp_id', $property->id)
                ->where('id', '!=', $requestItem->id)
                ->whereIn('status', ['pending', 'accepted'])
                ->get();

            foreach ($otherRequests as $req) {
                if ($req->rate > $property->available_percentage) {
                    $req->update(['status' => 'rejected']);
                }
            }

            // إذا تم شراء كامل العقار
            if ($requestItem->rate == 100) {
                $property->update(['user_id' => $requestItem->user_id]);
                $property->typeRequest->update(['name' => 'done']);
            } else {
                $requestItem->update([
                    'status' => 'investment',
                    'contract' => $path
                ]);
            }

            // ===== تحديث العقار للعرض على الإيجار إذا كان بيع جزئي =====
            if (
                $property->status === 'done' &&
                $property->typeRequest->name === 'partialSell' &&
                $property->RT_id === null
            ) {
                $admin = User::where('role', 'admin')->first();

                if ($admin) {
                    $rentType = TypeRequest::firstOrCreate([
                        'name' => 'Rent'
                    ]);

                    $property->update([
                        'user_id' => $admin->id,
                        'price' => $property->price * 0.05,
                        'RT_id' => $rentType->id,
                        'available_percentage' => 100,
                        'is_approved' => true,
                        'status' => 'view'
                    ]);
                }
            }


            $buyer->notify(new GenericNotification(
                "The contract has been uploaded successfully",
                "/investments/{$requestItem->id}/contract",
                NotificationType::CONTRACT_UPLOADED
            ));

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

    public function rejection($id)
    {
        $user = Auth::user();

        $request = RequestModel::findOrFail($id);
        $seller = $request->poperitys->user ?? null;
        if ($seller) {
            $seller->notify(new GenericNotification(
                "Request was rejected by the buyer",
                "/user/requests/{$request->id}",
                NotificationType::REQUEST_REJECTED
            ));
        }
        $request->update(['is_rejected' => true]);

        $request->update(['status' => 'rejected']);

        PaymentController::handlePaymentOnStatusChange($request);

        return response()->json([
            'success' => true,
            'message' => "تم رفض العقار من الشاري "
        ]);
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
    public function myShares(): JsonResponse
    {
        try {
            $user = Auth::user();

            $shares = RequestModel::with(['poperitys.typeRequest'])
                ->where('user_id', $user->id)
                ->where('status', 'investment')
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'shares' => MyShareResource::collection($shares),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching my shares: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching shares.'
            ], 500);
        }
    }

    public function showMyShare($id): JsonResponse
    {
        try {
            $share = RequestModel::with(['poperitys', 'poperitys.user'])->find($id);

            if (!$share) {
                return response()->json([
                    'success' => false,
                    'message' => 'Share not found'
                ], 404);
            }

            if ($share->status !== 'investment') {
                return response()->json([
                    'success' => false,
                    'message' => 'This request is not an investment'
                ], 403);
            }

            if (Gate::denies('viewshare', $share)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new MyShareResource($share)
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching share: ' . $e->getMessage(), [
                'share_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function getContract($id): JsonResponse
    {
        try {
            $share = RequestModel::find($id);

            if (!$share) {
                return response()->json([
                    'success' => false,
                    'message' => 'Share not found'
                ], 404);
            }

            if ($share->status !== 'investment') {
                return response()->json([
                    'success' => false,
                    'message' => 'This request is not an investment'
                ], 403);
            }

            if (Gate::denies('viewshare', $share)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            if (!$share->contract || !file_exists(storage_path('app/public/' . $share->contract))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contract file not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'contract_url' => asset('storage/' . $share->contract)

            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching share contract', [
                'share_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
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

            $shares = RequestModel::with(['poperitys', 'user'])
                ->where('status', 'investment')
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'shares' => MyShareResource::collection($shares),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching all shares: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching shares'
            ], 500);
        }
    }
}
