<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePoperityRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

  
    public function rules(): array
    {
        return [
            'address' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'area' => 'required|numeric|min:0',
            'status' => 'required|string|max:25',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'condition' => 'required|string|max:100',
            'RT_id' => 'nullable|exists:type_requests,id',
        'images' => 'nullable|array',  
        'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
            'type' => 'nullable|string|max:100',

'type_request'=> 'required|string',            

            
            'available_percentage' => 'required|numeric|min:0|max:100',
        ];
    }
}