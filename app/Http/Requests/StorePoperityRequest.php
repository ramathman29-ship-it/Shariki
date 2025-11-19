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
          "id"=>"require|integer|unique roles,id,except,id"
, 'address'=>'required|string|max:100',"location"=>'required|string|max:100',
            "project"=>'nullable|string|max:255', "video"=>'nullable|string|max:255',"area"=>'required|integer',"status"=>'required|string|max:25',
        "price"=>'required|integer',
            "description"=>'nullable|string', "condition"=>'required|string|max:100', "RT_id"=>'required|exists:type_requests,id'
       ,"user_id"=>'required|exists:users,id','type' => 'nullable|string|max:100'

        ];
    }
}
