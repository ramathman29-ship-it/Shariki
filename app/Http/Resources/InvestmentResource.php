<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'share_amount' => $this->rate,
            'contract'=>$this->contract,
            'property' => $this->prp_id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
           
        ];
    }
}
