<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PoperityResource;
class InvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'share_amount' => $this->rate,
            'contract'=>asset('storage/' . $this->contract),
            'submission date'=>$this->submission_date,
            'property' => new PoperityResource($this->whenLoaded('poperitys')),
        ];
    }
}
