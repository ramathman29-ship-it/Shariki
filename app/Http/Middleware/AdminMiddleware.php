<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'غير مسجل دخول'], 401);
        }

        $user->load('roles');

        // تأكد من وجود اسم الدور "admin" بأي شكل (كبر/صغر حروف/فراغات)
        $isAdmin = $user->roles->pluck('name')
            ->map(fn($name) => strtolower(trim($name)))
            ->contains('admin');

        if (!$isAdmin) {
            return response()->json(['message' => 'غير مصرح لك بالدخول (Admin فقط)'], 403);
        }

        return $next($request);
    }
}
