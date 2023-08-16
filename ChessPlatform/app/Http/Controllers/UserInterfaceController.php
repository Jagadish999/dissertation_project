<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use Session;
use App\Http\Controllers\MoveDetails;

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

    function playView(){
        return view('play');
    }

    function level1Black(){


        $user = User::where('Id', '=', session::get('userId'))->first();

        //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
        $fenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        

        $data = array();
        $data = [
            "gameType" => "Engine Level 1",
            "apiObject" => [
                "fenPosition" => $fenPos,
                "yourId" => $user->Id,
                "yourName" => $user->Fullname,
                "playerWhiteId" => "computer",
                "playerBlackId" => $user->Id,
                "yourColor" => "b",
                "castelDetails" => [
                    "whiteKingMoved" => false,
                    "whiteKingChecked" => false,
                    "whiteKingSideRookMoved" => false,
                    "whiteKingSideRookCaptured" => false,
                    "whiteKingSideSquaresChecked" => false,
                    "whiteQueenSideRookMoved" => false,
                    "whiteQueenSideRookCaptured" => false,
                    "whiteQueenSideSquaresChecked" => false,
                    
                    "blackKingMoved" => false,
                    "blackKingChecked" => false,
                    "blackKingSideRookMoved" => false,
                    "blackKingSideRookCaptured" => false,
                    "blackKingSideSquaresChecked" => false,
                    "blackQueenSideRookMoved" => false,
                    "blackQueenSideRookCaptured" => false,
                    "blackQueenSideSquaresChecked" => false
                ]
            ]
        ];

        return view('chessEnginePlayGround', compact('data'));
    }

    function level1White(){

        $user = User::where('Id', '=', session::get('userId'))->first();

        $fenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";

        $data = array();
        $data = [
            "gameType" => "Engine Level 1",
            "apiObject" => [
                "fenPosition" => $fenPos,
                "yourId" => $user->Id,
                "yourName" => $user->Fullname,
                "playerWhiteId" => $user->Id,
                "playerBlackId" => "computer",
                "yourColor" => "w",
                "castelDetails" => [
                    "whiteKingMoved" => false,
                    "whiteKingChecked" => false,
                    "whiteKingSideRookMoved" => false,
                    "whiteKingSideRookCaptured" => false,
                    "whiteKingSideSquaresChecked" => false,
                    "whiteQueenSideRookMoved" => false,
                    "whiteQueenSideRookCaptured" => false,
                    "whiteQueenSideSquaresChecked" => false,
                    
                    "blackKingMoved" => false,
                    "blackKingChecked" => false,
                    "blackKingSideRookMoved" => false,
                    "blackKingSideRookCaptured" => false,
                    "blackKingSideSquaresChecked" => false,
                    "blackQueenSideRookMoved" => false,
                    "blackQueenSideRookCaptured" => false,
                    "blackQueenSideSquaresChecked" => false
                ]
            ]
        ];

        return view('chessEnginePlayGround', compact('data'));
    }
}
