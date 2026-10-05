<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class PoperityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
{
    return [
        'id' => $this->id,
        'address' => $this->address,
        'location' => $this->location,
        'project' => $this->project,
        'description' => $this->description,
        'area' => $this->area,
        'video' => $this->video,
        'price' => $this->price,
        'status' => $this->status,
        'condition' => $this->condition,
        'type' => $this->type,
        'available_percentage' => $this->available_percentage,
        'type_request' => $this->typerequest?->name,
        'created_at' => $this->created_at,
        // Uploaded photos live in storage; demo photos are full URLs
        'photos' => $this->photos->map(function ($photo) {
            if (!$photo->image_path) return null;
            return Str::startsWith($photo->image_path, ['http://', 'https://'])
                ? $photo->image_path
                : asset('storage/' . $photo->image_path);
        }),
        'suffixes' => $this->whenLoaded('suffixes', fn () => $this->suffixes->map(fn ($s) => [
            'title' => $s->title,
            'description' => $s->description,
        ])),
    ];
}
}
