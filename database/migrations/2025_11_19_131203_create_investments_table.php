<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
             $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
             $table->foreignId('prp_id')->constrained('poperities')->cascadeOnDelete();
            $table->date("submission_date");
             $table->integer("rate");
             $table->string("contract");
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};
