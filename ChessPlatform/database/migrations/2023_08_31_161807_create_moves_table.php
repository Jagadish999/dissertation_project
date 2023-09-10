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
            $table->string('matchType');
            $table->string('startingFenPosition');
            $table->string('finalFenPosition');
            $table->string('move');
            $table->string('recordedTime');
            $table->unsignedBigInteger('remainingTimeWhite');
            $table->unsignedBigInteger('remainingTimeBlack');

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
