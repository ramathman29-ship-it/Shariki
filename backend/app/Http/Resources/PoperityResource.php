<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'price' => $this->price,
            'status' => $this->status,
            'condition' => $this->condition,
            'type' => $this->type,
            'available_percentage' => $this->available_percentage,
            'type_request' => $this->typerequest?->name,  
               
        ];
            
        
    }
}
