<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserInterfaceController;
use App\Http\Controllers\MatchTypeController;

Route::get('/dashboard', [UserInterfaceController::class, 'dashboardView'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/play', [UserInterfaceController::class, 'playView'])->middleware(['auth', 'verified']);

Route::get('/play/engine/level-1-black', [UserInterfaceController::class, 'level1Black'])->middleware(['auth', 'verified']);

Route::get('/play/engine/level-1-white', [UserInterfaceController::class, 'level1White'])->middleware(['auth', 'verified']);

Route::get('/play/online/{onlineChannelNumber}', [UserInterfaceController::class, 'onlineMultiplayer'])->middleware(['auth', 'verified']);

Route::post('/playerSelectedGameType', [MatchTypeController::class, 'MatchSelected'])->middleware(['auth', 'verified']);

Route::post('/playersMatched', [MatchTypeController::class, 'broadCastPlayerMatching'])->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';