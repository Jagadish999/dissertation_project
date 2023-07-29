<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterAndLoginController;
use App\Http\Controllers\UserInterfaceController;

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

//Route fro multiplayer
Route::get('/multiplayer', [UserInterfaceController::class, 'MultiplayerView'])->middleware('userLoggedIn');