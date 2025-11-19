<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePoperityRequest extends FormRequest
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
            'address'=>'sometimes|string|max:100',"location"=>'sometimes|string|max:100',
            "project"=>'sometimes|string|max:255', "video"=>'sometimes|string|max:255',"area"=>'sometimes|integer|max:15',"stauts"=>'sometimes|string|max:25',
            "price"=>'sometimes|integer|max:15',
            "description"=>'sometimes|string', "condition"=>'sometimes|string|max:100',
            "RT_id"=>'sometimes|exists:typy__requests'
       ,"user_id"=>'sometimes|exists:users'

        ];
    }
}
