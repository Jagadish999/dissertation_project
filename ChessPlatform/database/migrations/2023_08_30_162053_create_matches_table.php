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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('whitePlayer');
            $table->unsignedBigInteger('blackPlayer');
            $table->string('gameType');
            $table->string('gameStatus');

            $table->foreign('whitePlayer')->references('id')->on('users');
            $table->foreign('blackPlayer')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
