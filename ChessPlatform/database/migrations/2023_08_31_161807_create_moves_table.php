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
        Schema::create('moves', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('matchNumber');
            $table->string('FenPosition');
            $table->string('Move');

            $table->foreign('matchNumber')->references('id')->on('matches');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};
