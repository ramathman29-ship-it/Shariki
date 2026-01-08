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
use App\Notifications\GenericNotification;
use App\Enums\NotificationType;
class PoperityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    /*
     * عرض كل العقارات الموافق عليها
     */
    public function index(Request $request)
    {
        $query = Poperity::with('photos', 'typerequest')->where('is_approved', true);

        $this->applyFilters($query, $request);

        $properties = $query->get();

        return response()->json([
            'count' => $properties->count(),
            'properties' => PoperityResource::collection($properties)
        ]);
    }

    /*
     * عرض العقارات غير الموافق عليها (للأدمن فقط)
     */
    public function indexnotapprove(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = Poperity::with('photos', 'typerequest')->where('is_approved', false);

        $this->applyFilters($query, $request);

        $properties = $query->get();

        return response()->json([
            'count' => $properties->count(),
            'properties' => PoperityResource::collection($properties)
        ]);
    }

    /*
     * عرض عقارات المستخدم
     */
    public function indexUser(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $query = Poperity::with('photos', 'typerequest')
            ->where('user_id', $user->id);

        $this->applyFilters($query, $request);

        $properties = $query->get();
       
        return response()->json([
            'count' => $properties->count(),
            'properties' => PoperityResource::collection($properties)
        ]);
    }

    /*
     * إنشاء عقار جديد + رفع صور متعددة + لواحق
     */
    public function store(StorePoperityRequest $request)
{
    $user = Auth::user();

    // إنشاء العقار
    $property = Poperity::create(array_merge(
        $request->validated(),
        [
            'user_id' => $user->id,
            'is_approved' => false
        ]
    ));

    // نوع الطلب (إن وُجد)
    if ($request->filled('type_request')) {
        $typeRequest = TypeRequest::create([
            'name' => $request->type_request
        ]);
        $property->RT_id = $typeRequest->id;
        $property->save();
    }

    // تحديث حالة العقار
   $property->updateStatus();

    // حفظ الصور (مجموعة صور متعددة)
    $this->storeImages($property, $request->file('images', []));

    // حفظ اللواحق
    $this->storeSuffixe($property, $request->input('suffixes', []));

    // إعادة التحميل مع الصور
    $property->load('photos', 'typerequest', 'suffixes');
    $admins = User::all()->filter(fn($user) => $user->isAdmin());

    foreach ($admins as $admin) {
        $admin->notify(new GenericNotification(
            "You have a new property wait your approve",
            "/properties/{$property->id}", 
            NotificationType::REQUEST_PENDING_APPROVAL
        ));
    }
    return response()->json([
        'success' => true,
        'message' => 'تم إنشاء العقار بنجاح، بانتظار الموافقة',
        'property' => new PoperityResource($property)
    ], 201);
}

    /*
     * عرض عقار غير موافق عليه
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
                'message' => 'هذا العقار بانتظار الموافقة'
            ], 403);
        }

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'property' => new PoperityResource($poperity)
        ]);
    }

    /*
     * عرض عقار موافق عليه
     */
    public function show(Poperity $poperity)
    {
        if (!$poperity->is_approved && Auth::id() !== $poperity->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'هذا العقار بانتظار الموافقة'
            ], 403);
        }

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'property' => new PoperityResource($poperity)
        ]);
    }

    /*
     * عرض عقار للمالك فقط
     */
    public function showUser(Poperity $poperity)
    {
        $user = Auth::user();

        if (!$user || $poperity->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'property' => new PoperityResource($poperity)
        ]);
    }

    /*
     * تحديث عقار
     */
    public function update(UpdatePoperityRequest $request, Poperity $poperity)
    {
        Gate::authorize('update', $poperity);

        $poperity->update($request->validated());

        $this->storeImages($poperity, $request->file('images', []));
        $this->storeSuffixe($poperity, $request->input('suffixes', []));

        $poperity->load('photos', 'typerequest', 'suffixes');

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث العقار بنجاح',
            'property' => new PoperityResource($poperity)
        ]);
    }

    /*
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

    /*
     * موافقة الأدمن على العقار
     */
    public function approve($id)
    {
        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'غير مصرح'], 403);
        }

        $property = Poperity::findOrFail($id);

        $property->update(['is_approved' => true]);

        
       $property->updateStatus();
        $propertyOwner= $property->user;
        $propertyOwner->notify(new GenericNotification(
            "Your property approved",
            "/propertyforuser/{$property->id}", 
            NotificationType::PROPERTY_APPROVED
        ));
        return response()->json([
            'success' => true,
            'message' => 'تمت الموافقة على العقار'
        ]);
    }
public function notapprove($id)
{
    $user = Auth::user();

    if (!$user || !$user->isAdmin()) {
        return response()->json(['success' => false, 'message' => 'غير مصرح'], 403);
    }

    $property = Poperity::with('photos')->findOrFail($id);


    $property->update(['is_approved' => false]);

    
    foreach ($property->photos as $photo) {
        if (\Storage::disk('public')->exists($photo->image_path)) {
            \Storage::disk('public')->delete($photo->image_path);
        }
        $photo->delete();
    }

    // حذف العقار نفسه
    $property->delete();

    return response()->json([
        'success' => true,
        'message' => 'تم رفض وحذف العقار مع الصور المرتبطة'
    ]);
}

public static function autoRentFromPartialSales()
{
    $admin = User::all()->first(fn($user) => $user->isAdmin());

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'لا يوجد مستخدم أدمن'
        ], 404);
    }

    // جلب العقارات المنتهية وبيع جزئي
    $properties = Poperity::where('status', 'done')
        ->whereHas('typerequest', function($q) {
            $q->where('name', 'partialSell'); 
        })->get();

    $updatedProperties = [];

    foreach ($properties as $property) {

        
        $typeRequest = TypeRequest::firstOrCreate([
            'name' => 'Rent'
        ]);

        
        $property->update([
            'user_id' => $admin->id,          
            'price' => $property->price * 0.05,
            'RT_id' => $typeRequest->id,       
            'available_percentage' => 100,
            'is_approved' => true,
            'status' => 'view'
        ]);

        $updatedProperties[] = $property;
    }

    return response()->json([
        'success' => true,
        'updated_properties' => $updatedProperties
    ]);
}



 

    /*
     * رفع مجموعة صور للعقار
     */
   private function storeImages(Poperity $property, $images)
{
    if (!is_array($images)) {
        return;
    }

    foreach ($images as $imageFile) {
        if ($imageFile && $imageFile->isValid()) {
            $path = $imageFile->store('property_photos', 'public');

            Image::create([
                'poperity_id' => $property->id,
                'image_path' => $path,  // العمود الصحيح في الجدول
                'title' => $imageFile->getClientOriginalName(), // أو null إذا لا تريد العنوان
            ]);
        }
    }
}
    

    /*
     * حفظ اللواحق
     */
    private function storeSuffixe(Poperity $property, $suffixes)
    {
        if (!is_array($suffixes)) return;

        foreach ($suffixes as $suff) {
            $property->suffixes()->create([
                'title' => $suff['title'],
                'description' => $suff['description'],
            ]);
        }
    }

    /*
     * تطبيق الفلاتر
     */
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('city')) $query->where('location', 'LIKE', '%' . $request->city . '%');
        if ($request->filled('min_price')) $query->where('price', '>=', $request->min_price);
        if ($request->filled('max_price')) $query->where('price', '<=', $request->max_price);
        if ($request->filled('RT_id')) $query->where('RT_id', $request->RT_id);
        if ($request->filled('type')) $query->where('type', $request->type);
    }

   
}
