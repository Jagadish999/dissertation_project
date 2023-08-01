<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterAndLoginController;
use App\Http\Controllers\UserInterfaceController;
use App\Http\Controllers\MatchMakingController;

Route::get('/login', function() {
    return view('login');
})->middleware('userLoggedOut');

Route::get('/register', function() {
    return view('register');
})->middleware('userLoggedOut');

//for registering new users
Route::post('/user-registered', [RegisterAndLoginController::class, 'userRegistrationBeginning'])->name('user-registered');

//Route form logIn
Route::post('/user-logged', [RegisterAndLoginController::class, 'userLogged'])->name('user-logged');

//Route form logOut
Route::get('/logout', [RegisterAndLoginController::class, 'userLogOut'])->middleware('userLoggedIn');

//Route for dashboard
Route::get('/dashboard', [UserInterfaceController::class, 'dashboardView'])->middleware('userLoggedIn');

//Route for multiplayer
Route::get('/multiplayer', [UserInterfaceController::class, 'MultiplayerView'])->middleware('userLoggedIn');

Route::get('/blitz', [MatchMakingController::class, 'matchBlitzPlayer'])->middleware('userLoggedIn');

Route::get('/bullet', [MatchMakingController::class, 'matchBulletPlayer'])->middleware('userLoggedIn');

Route::get('/classic', [MatchMakingController::class, 'matchClassicPlayer'])->middleware('userLoggedIn');

Route::get('/playerFound', [MatchMakingController::class, 'waitingPlayerMatchMaking'])->name('playerFound');

Route::get('/whitePlayerFound', [MatchMakingController::class, 'whitePlayerMatched'])->middleware('userLoggedIn');