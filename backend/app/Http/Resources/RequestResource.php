<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
   
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property' => $this->prp_id,
            'property_id' => $this->prp_id,
            // short summary so the user pages can show what the request is for
            'property_info' => $this->whenLoaded('poperitys', fn () => $this->poperitys ? [
                'id' => $this->poperitys->id,
                'address' => $this->poperitys->address,
                'location' => $this->poperitys->location,
                'project' => $this->poperitys->project,
                'price' => $this->poperitys->price,
                'type_request' => $this->poperitys->typeRequest?->name,
                'photo' => (new PoperityResource($this->poperitys->loadMissing('photos', 'typeRequest')))
                    ->toArray($request)['photos'][0] ?? null,
                'owner' => $this->poperitys->user?->name,
            ] : null),
            'description' => $this->description,
            'rate' => $this->rate,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'submitted_at' => $this->submission_date,
            'contract_image' => $this->contract
                ? asset('storage/' . $this->contract)
                : null,
            
                'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
        ];
    }
}
