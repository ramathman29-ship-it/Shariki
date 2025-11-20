<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePoperityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'address' => 'required|string|max:100',
            'location' => 'required|string|max:100',
            'project' => 'nullable|string|max:255',
            'video' => 'nullable|string|max:255',
            'area' => 'required|numeric|min:0',
            'status' => 'required|string|max:25',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'condition' => 'required|string|max:100',
            'RT_id' => 'nullable|exists:type_requests,id',
            'user_id' => 'required|exists:users,id',
            'type' => 'nullable|string|max:100',
'type_request'=> 'required|string',
            // الصور
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',

            // اللواحق
            'suffixes' => 'nullable|array',
            'suffixes.*.title' => 'required_with:suffixes|string|max:255',
            'suffixes.*.description' => 'nullable|string|max:500',

            // النسبة المتاحة للبيع
            'available_percentage' => 'required|numeric|min:0|max:100',
        ];
    }
}
