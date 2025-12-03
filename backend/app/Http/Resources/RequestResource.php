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
            'description' => $this->description,
            'rate' => $this->rate,
            'status' => $this->status,
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
