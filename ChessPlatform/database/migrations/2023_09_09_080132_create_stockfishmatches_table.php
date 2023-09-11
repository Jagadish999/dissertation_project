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
        Schema::create('stockfish_matches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('playerId');
            $table->string('playerColor');
            $table->string('stockfishColor');
            $table->unsignedBigInteger('level');
            $table->string('gameStatus');


            $table->foreign('playerId')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stockfishmatches');

        Schema::create('moves', function (Blueprint $table) {
            $table->id();
            $table->integer('stockfish_match_number');
            $table->text('startingFenPosition');
            $table->text('finalFenPosition');
            $table->string('move');
            // Add any other columns you need here
            $table->timestamps();
        });
    }
};
