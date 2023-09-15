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
        Schema::create('completed_puzzles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('playerId');
            $table->unsignedBigInteger('puzzleId');
            $table->string('status');

            // Define foreign keys if necessary
            $table->foreign('playerId')->references('id')->on('users');
            $table->foreign('puzzleId')->references('id')->on('puzzles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('completed_puzzle');
    }
};
