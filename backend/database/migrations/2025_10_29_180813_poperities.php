
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
        Schema::create('poperities', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->string('location');
            $table->string('description')->nullable();
            $table->string('project')->nullable();
          $table->string('type')->nullable();
          $table->float('available_percentage')->default(100);
            $table->string('condition');
            $table->string('video')->nullable();
            $table->integer('area');
            $table->string('status');
             $table->integer('price');
             $table->boolean('is_approved')->default(false);
              $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
             $table->foreignId('RT_id')->nullable()->constrained('type_requests')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poperitys');
    }
};
