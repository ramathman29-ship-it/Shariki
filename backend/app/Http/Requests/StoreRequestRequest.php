<?php

namespace App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Poperity;
class StoreRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();;
    }

    public function rules(): array
    {
        $rules = [
            'prp_id' => 'required|integer|exists:poperities,id',
            'description' => 'required|string|max:255',
        ];

        $propertyId = $this->input('prp_id');
        if ($propertyId) {
            $property = Poperity::with('typeRequest')->find($propertyId);
            if (optional($property->typeRequest)->name === 'partialSell') {
                $rules['rate'] = 'required|integer|min:1|max:100';
            }
            
        }

        return $rules;
    }
    public function messages(): array
    {
        return [
            'rate.required' => 'You must enter a rate for partial sale properties.',
            'rate.max' => 'Rate cannot exceed 100%.',
            'rate.min' => 'Rate must be at least 1%'
        ];
    }
}
