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
        Schema::create('stockfish_moves', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('matchNumber');
            $table->text('startingFenPosition');
            $table->text('finalFenPosition');
            $table->string('move');
            // Add any other columns you need here
            $table->foreign('matchNumber')->references('id')->on('stockfish_matches');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stockfish_moves');
    }
};
