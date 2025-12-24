<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            // 'id' => $this->id,
            'type' => $this->data['type'] ?? 'general',
            'message' => $this->data['message'] ?? '',
            'url' => $this->data['url'] ?? null,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
