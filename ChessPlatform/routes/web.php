<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserNavigationController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\MatchTypeController;

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
Route::post('/engineMatchMoves', [MatchController::class, 'recordMovesWithEngine'])->middleware(['auth', 'verified']);


//About to match player
Route::post('/playerSelectedGameType', [MatchController::class, 'MatchSelected'])->middleware(['auth', 'verified']);

//Player Matched
Route::post('/playersMatched', [MatchController::class, 'broadCastPlayerMatching'])->middleware(['auth', 'verified']);

//Player rating updated
Route::post('/updateRating', [MatchController::class, 'updatePlayerRating'])->middleware(['auth', 'verified']);

Route::get('/play/online/{onlineChannelNumber}', [MatchController::class, 'onlineMultiplayer'])->middleware(['auth', 'verified']);

Route::post('/playersMadeMove', [MatchController::class, 'broadCastPlayerMove'])->middleware(['auth', 'verified']);

Route::post('/playerMessaged', [MatchController::class, 'broadCastPlayerMessage'])->middleware(['auth', 'verified']);

Route::post('/recordPlayerMove', [MatchController::class, 'recordMoveInDB'])->middleware(['auth', 'verified']);


//Route For analysis match part

Route::get('/analysis/{matchType}/{matchNumber}', [MatchController::class, 'analysisMatchDetails'])->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';