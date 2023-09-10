<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserInterfaceController;
use App\Http\Controllers\MatchTypeController;
use App\Http\Controllers\UserNavigationController;
use App\Http\Controllers\MatchController;





//Routes for navigation menus
Route::get('/dashboard', [UserNavigationController::class, 'dashboardView'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/play', [UserNavigationController::class, 'playView'])->middleware(['auth', 'verified'])->name('playView');

Route::get('/puzzle', [UserNavigationController::class, 'playPuzzleView'])->middleware(['auth', 'verified']);

Route::get('/addpuzzle', [UserNavigationController::class, 'addPuzzleView'])->middleware(['auth', 'verified']);

Route::get('/leaderboard', [UserNavigationController::class, 'leaderBoardView'])->middleware(['auth', 'verified']);

Route::get('/analysis', [UserNavigationController::class, 'gameAnalysisView'])->middleware(['auth', 'verified']);


//Routes for match with engine

Route::post('/engineMatchSelected', [MatchController::class, 'insertEngineMatchDetails'])->middleware(['auth', 'verified']);
Route::get('/engineground/{matchNumber}', [MatchController::class, 'redirectEnginePlayGround'])->middleware(['auth', 'verified']);



// Route::get('/play/engine/level-1-black', [UserInterfaceController::class, 'level1Black'])->middleware(['auth', 'verified']);

// Route::get('/play/engine/level-1-white', [UserInterfaceController::class, 'level1White'])->middleware(['auth', 'verified']);

Route::get('/play/online/{onlineChannelNumber}', [UserInterfaceController::class, 'onlineMultiplayer'])->middleware(['auth', 'verified']);



Route::get('/analysisMatch/{matchId}', [UserInterfaceController::class, 'analysisInformation'])->middleware(['auth', 'verified']);


Route::post('/playerSelectedGameType', [MatchTypeController::class, 'MatchSelected'])->middleware(['auth', 'verified']);

Route::post('/playersMatched', [MatchTypeController::class, 'broadCastPlayerMatching'])->middleware(['auth', 'verified']);

Route::post('/playersMadeMove', [MatchTypeController::class, 'broadCastPlayerMove'])->middleware(['auth', 'verified']);

Route::post('/playerMessaged', [MatchTypeController::class, 'broadCastPlayerMessage'])->middleware(['auth', 'verified']);

Route::post('/matchOver', [MatchTypeController::class, 'updateRating'])->middleware(['auth', 'verified']);



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';