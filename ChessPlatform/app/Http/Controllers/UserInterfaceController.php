<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use Session;
use App\Events\ChessGamePlayApi;

class UserInterfaceController extends Controller
{
    function dashboardView(){

        $user = User::where('Id', '=', session::get('userId'))->first();
        $rating = Rating::where('userId', '=', session::get('userId'))->first();

        $data = array();

        $data = [
            "Id" => $user->Id,
            "Fullname" => $user->Fullname,
            "Email" => $user->Email,
            "Role" => $user->Role,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic
        ];

        return view('dashboard', compact('data'));
    }

    function MultiplayerView(){
        return view('multiplayer');
    }
}
