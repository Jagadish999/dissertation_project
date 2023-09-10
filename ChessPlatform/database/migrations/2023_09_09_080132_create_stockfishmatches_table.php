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
    }
};
