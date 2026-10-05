<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PaymentController يكتب payment_status في جدول payments لكن العمود لم يكن موجوداً.
     */
    public function up(): void
    {
        if (Schema::hasColumn('payments', 'payment_status')) {
            return;
        }

        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_status')->default('pending')->after('status');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('payments', 'payment_status')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropColumn('payment_status');
            });
        }
    }
};
