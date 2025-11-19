<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePoperityRequest;
use App\Models\Poperity;
use App\Models\Image;
use Illuminate\Http\Request;

class PoperityController extends Controller
{
   
    public function store(StorePoperityRequest $request)
    {
       
        $property = Poperity::create($request->validated());

       
        $this->storeImages($property, $request->file('images', []));

        
        $property->load('photos', 'typerequest');

        return response()->json([
            'message' => 'تم إنشاء العقار بنجاح مع الصور',
            'property' => $this->formatProperty($property)
        ], 201);
    }

   
    public function show($id)
    {
        $property = Poperity::with('photos', 'typerequest')->findOrFail($id);
        return response()->json($this->formatProperty($property));
    }

    
    public function index(Request $request)
    {
        $query = Poperity::with('photos', 'typerequest');

       
        $this->applyFilters($query, $request);

        $properties = $query->get();

        $data = $properties->map(fn($property) => $this->formatProperty($property));

        return response()->json([
            'count' => $data->count(),
            'properties' => $data
        ]);
    }

   
    private function storeImages(Poperity $property, array $images)
    {
        foreach ($images as $imageFile) {
            $path = $imageFile->store('property_photos', 'public');
            Image::create([
                'poperity_id' => $property->id,
                'path' => $path,
            ]);
        }
    }

  
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('city')) {
            $query->where('location', 'LIKE', '%' . $request->city . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('RT_id')) {
            $query->where('RT_id', $request->RT_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
    }

   
    private function formatProperty(Poperity $property): array
    {
        return [
            'id' => $property->id,
            'address' => $property->address,
            'location' => $property->location,
            'price' => $property->price,
            'status' => $property->status,
            'condition' => $property->condition,
            'type' => $property->type,
            'type_request' => $property->typerequest->name ,
            'images' => $property->photos->map(fn($img) => asset('storage/' . $img->path)),
            
        ];
    }
}
