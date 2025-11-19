<?php

namespace App\Http\Requests;


use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreUserRequest extends FormRequest
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
    'name' => 'required|string|max:20',
    'email' => 'required|email|max:50|unique:users,email',
    'password' => 'required|string|min:8|confirmed',
    'personal_id' => 'required|integer',
    'gender' => 'required|string|max:20',
    'birthday' => 'required|date',
    'mobile1' => 'required|string|max:15',
    'nationality' => 'required|string|max:20',
    'job' => 'required|string|max:50',
    'residency' => 'required|string|max:20',
    'budget' => 'required|integer'
];

    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()->toArray()
        ], 422));
    }
}