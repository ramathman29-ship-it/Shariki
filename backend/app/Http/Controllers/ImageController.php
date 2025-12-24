<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // التحقق من وجود الصور
        if(!$request->hasFile('image_path')) {
            return response()->json([
                'message' => 'No files found in the request'
            ], 400);
        }

        $request->validate([
            'image_path' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $paths = [];

        foreach ($request->file('image_path') as $image) {
            $paths[] = $image->store('uploads/images', 'public');
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'paths' => $paths
        ]);
    }
}
