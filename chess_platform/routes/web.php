<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserRegistrationLoginController;
use App\Http\Controllers\NavigationPageController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/playerLogin', [UserRegistrationLoginController::class, 'playerLoggedInForm'])->middleware('playerLoggedOut');

Route::get('/playerRegistration', [UserRegistrationLoginController::class, 'playerRegisteredForm'])->middleware('playerLoggedOut');

Route::post('/player-registered', [UserRegistrationLoginController::class, 'playerRegistration'])->name('player-registered');

Route::post('/player-login', [UserRegistrationLoginController::class, 'playerLoggedIn'])->name('player-logged');

Route::get('/playerLogOut', [UserRegistrationLoginController::class, 'playerLoggedOut']);

//For page contents for logged players

Route::get('/dashboard', [UserRegistrationLoginController::class, 'dashboard'])->middleware('playerLoggedIn');


Route::get('/multiplayer', [NavigationPageController::class, 'multiplayer'])->middleware('playerLoggedIn');

Route::get('/leaderboards', [NavigationPageController::class, 'leaderboards'])->middleware('playerLoggedIn');

Route::get('/tournament', [NavigationPageController::class, 'tournament'])->middleware('playerLoggedIn');


Route::get('/profile', [NavigationPageController::class, 'profile'])->middleware('playerLoggedIn');


Route::get('/analysis', [NavigationPageController::class, 'analysis'])->middleware('playerLoggedIn');


Route::get('/puzzles', [NavigationPageController::class, 'puzzles'])->middleware('playerLoggedIn');

Route::get('/classic', [NavigationPageController::class, 'classic'])->middleware('playerLoggedIn');