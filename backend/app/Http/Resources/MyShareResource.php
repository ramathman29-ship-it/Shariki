<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MyShareResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'share_amount' => $this->rate,
            'contract' => $this->contract
                ? asset('storage/' . $this->contract)
                : null,
            'submission_date' => $this->submission_date,
            'property' => new PoperityResource(
                $this->whenLoaded('poperitys')
            ),
        ];
    }
}
