<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class GenericNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $message;
    public ?string $url;
    public NotificationType $type;

    public function __construct(
        string $message,
        ?string $url,
        NotificationType $type
    ) {
        $this->message = $message;
        $this->url = $url;
        $this->type = $type;
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable): array
    {
        try {
            return [
                'message' => $this->message,
                'url' => $this->url,
                'type' => $this->type->value,
            ];
        } catch (\Throwable $e) {
            Log::error("Failed to store notification in database: " . $e->getMessage());
            return [
                'message' => 'Notification error',
                'url' => null,
                'type' => $this->type->value,
            ];
        }
    }
    public function toBroadcast($notifiable): BroadcastMessage
    {
        try {
            return new BroadcastMessage([
                'id' => $this->id,
                'message' => $this->message,
                'url' => $this->url,
                'type' => $this->type->value,
                'created_at' => now()->toDateTimeString(),
            ]);
        } catch (\Throwable $e) {
            Log::error("Failed to broadcast notification: " . $e->getMessage());
            return new BroadcastMessage([
                'id' => $this->id,
                'message' => 'Notification error',
                'url' => null,
                'type' => $this->type->value,
                'created_at' => now()->toDateTimeString(),
            ]);
        }
    }
}
