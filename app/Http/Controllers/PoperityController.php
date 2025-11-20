<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StorePoperityRequest;
use App\Http\Requests\UpdatePoperityRequest;
use App\Models\Poperity;
use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Resources\PoperityResource;
use App\Models\TypeRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class PoperityController extends Controller
{
    public function __construct()
    {
        // المصادقة إلزامية لكل شيء باستثناء العرض
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /**
     * عرض جميع العقارات الموافق عليها فقط
     */
    public function index(Request $request)
    {
        $query = Poperity::with('photos', 'typerequest')
                        ->where('is_approved', true); 

        $this->applyFilters($query, $request);

        $properties = $query->get();

        $data = $properties->map(fn($property) => new PoperityResource($property));

        return response()->json([
            'count' => $data->count(),
            'properties' => $data
        ]);
    }

    public function indexnotapprove(Request $request)
    {
        $query = Poperity::with('photos', 'typerequest')
                        ->where('is_approved', false); 

        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false, 
                'message' => 'Unauthorized'
            ], 403);
        }

        $this->applyFilters($query, $request);

        $properties = $query->get();

        $data = $properties->map(fn($property) => new PoperityResource($property));
         
        return response()->json([
            'count' => $data->count(),
            'properties' => $data
        ]);
    }

    /**
     * إنشاء عقار جديد
     */
    public function store(StorePoperityRequest $request)
    {
        $user = Auth::user();
    
        $property = Poperity::create(array_merge(
            $request->validated(),
            [
                'user_id' => $user->id,
                'is_approved' => false
            ]
        ));

        $this->storeImages($property, $request->file('images', []));
        $this->storeSuffixe($property, $request->input('suffixes', []));

        if ($request->filled('type_request')) {
            $typeRequest = TypeRequest::create([
                'name' => $request->type_request,
            ]);
            $property->RT_id = $typeRequest->id;
            $property->save();
        }

        // تحديث الحالة تلقائيًا
        $this->updateStatus($property);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء العقار بنجاح، بانتظار موافقة الإدارة',
            'property' => new PoperityResource($property)
        ], 201);
    }

    /**
     * عرض عقار واحد
     */
    public function shownotapprove(Poperity $poperity)
    {
        if (
            !$poperity->is_approved &&
            Auth::id() !== $poperity->user_id &&
            !Auth::user()?->isAdmin()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'هذا العقار بانتظار موافقة الإدارة'
            ], 403);
        }

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'property' => new PoperityResource($poperity)
        ]);
    }

    public function show(Poperity $poperity)
    {
        if (!$poperity->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'هذا العقار بانتظار موافقة الإدارة'
            ], 403);
        }

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'property' => new PoperityResource($poperity)
        ]);
    }

    /**
     * تحديث عقار
     */
    public function update(UpdatePoperityRequest $request, Poperity $poperity)
    {
        Gate::authorize('update', $poperity);

        $poperity->update($request->validated());

        $this->storeImages($poperity, $request->file('images', []));
        $this->storeSuffixe($poperity, $request->input('suffixes', []));

        // تحديث الحالة تلقائيًا
        $this->updateStatus($poperity);

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث العقار بنجاح',
            'property' => new PoperityResource($poperity)
        ]);
    }

    /**
     * حذف عقار
     */
    public function destroy(Poperity $poperity)
    {
        Gate::authorize('delete', $poperity);

        $poperity->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف العقار بنجاح'
        ]);
    }

    /**
     * موافقة الأدمن على العقار
     */
    public function approve($id)
    {
        $user = Auth::user(); 
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'يجب تسجيل الدخول أولاً'
            ], 401);
        }

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بتنفيذ هذه العملية'
            ], 403);
        }

        $property = Poperity::findOrFail($id);
        $property->update(['is_approved' => true]);

        // تحديث الحالة تلقائيًا
        $this->updateStatus($property);

        return response()->json([ 
            'success' => true,
            'message' => 'تمت الموافقة على العقار بنجاح'
        ]);
    }

    /**
     * تخزين الصور المرتبطة بالعقار
     */
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

    /**
     * تخزين اللواحق المرتبطة بالعقار
     */
    private function storeSuffixe(Poperity $property, array $suffixes)
    {
        foreach ($suffixes as $suff) {
            $property->suffixes()->create([
                'title' => $suff['title'],
                'description' => $suff['description'],
            ]);
        }
    }

    /**
     * تطبيق الفلترة العامة على الاستعلام
     */
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('city')) $query->where('location', 'LIKE', '%' . $request->city . '%');
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('min_price')) $query->where('price', '>=', $request->min_price);
        if ($request->filled('max_price')) $query->where('price', '<=', $request->max_price);
        if ($request->filled('RT_id')) $query->where('RT_id', $request->RT_id);
        if ($request->filled('type')) $query->where('type', $request->type);
    }

    /**
     * تحديث حالة العقار بناءً على الموافقة ونسبة الإنجاز
     */
    private function updateStatus(Poperity $property)
    {
        if ($property->available_percentage==0) {
            $property->status = 'done';
        } elseif ($property->is_approved) {
            $property->status = 'view';
        } else {
            $property->status = 'building';
        }

        $property->save();
    }
}
