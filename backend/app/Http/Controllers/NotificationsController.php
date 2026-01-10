<?php

namespace App\Http\Controllers;

use App\Notifications\GenericNotification;
use App\Http\Resources\NotificationResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Events\NotificationEvent;

class NotificationsController extends Controller
{
    public function getNotifications(): JsonResponse
    {
        try {
            $user = Auth::user();

            $notifications = $user->notifications()->latest()->get();
            $unreadCount = $user->unreadNotifications()->count();
            $user->unreadNotifications->markAsRead();

            return response()->json([
                'success' => true,
                'unread_count' => $unreadCount,
                'data' => NotificationResource::collection($notifications),
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage(), [
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching notifications.'
            ], 500);
        }
    }

    public function markAllAsRead(): JsonResponse
    {
        try {
            $user = Auth::user();

            $user->unreadNotifications->markAsRead();

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking notifications as read: ' . $e->getMessage(), [
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error marking notifications as read'
            ], 500);
        }
    }



}
