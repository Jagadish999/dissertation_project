<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;
use Session;

class UserInterfaceController extends Controller
{
    function dashboardView(){

        $loggedUser = auth()->user();

        $user = User::where('id', '=', $loggedUser->id)->first();
        $rating = Rating::where('userId', '=', $loggedUser->id)->first();

        $data = array();
        $data = [
            "id" => $user->id,
            "fullname" => $user->name,
            "email" => $user->email,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic
        ];

        return view('dashboard', compact('data'));
    }

    function playView(){
        $loggedUser = auth()->user();

        $user = User::where('id', '=', $loggedUser->id)->first();
        $rating = Rating::where('userId', '=', $loggedUser->id)->first();

        $data = array();
        $data = [
            "id" => $user->id,
            "fullname" => $user->name,
            "email" => $user->email,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic
        ];

        return view('play', compact('data'));
    }

    function level1Black(){

        $loggedUser = auth()->user();
        $user = User::where('id', '=', $loggedUser->id)->first();

        $fenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        

        $data = array();
        $data = [
            "gameType" => "Engine Level 1",
            "apiObject" => [
                "fenPosition" => $fenPos,
                "yourId" => $user->id,
                "yourName" => $user->name,
                "playerWhiteId" => "computer",
                "playerBlackId" => $user->id,
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

        $loggedUser = auth()->user();
        $user = User::where('id', '=', $loggedUser->id)->first();

        $fenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";

        $data = array();
        $data = [
            "gameType" => "Engine Level 1",
            "apiObject" => [
                "fenPosition" => $fenPos,
                "yourId" => $user->id,
                "yourName" => $user->name,
                "playerWhiteId" => $user->id,
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

    function onlineMultiplayer(Request $request, $onlineChannelNumber){

        $matchDetails = Matche::where('id', '=', $onlineChannelNumber)->first();

        $whitePlayerId = $matchDetails->whitePlayer;
        $blackPlayerId = $matchDetails->blackPlayer;

        $whitePlayerDetail = User::where('id', '=', $whitePlayerId)->first();
        $blackPlayerDetail = User::where('id', '=', $blackPlayerId)->first();

        $loggedUser = auth()->user();
        $yourDetail = User::where('id', '=', $loggedUser->id)->first();

        $fenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";

        $data = array();
        $data = [
            "game" => "onlineMatch",
            "gameType" => $matchDetails->gameType,
            "channelNumber" => $onlineChannelNumber,

            "apiObject" => [
                "fenPosition" => $fenPos,
                "yourId" => $loggedUser->id,
                "yourName" => $loggedUser->name,
                "playerWhiteId" => $whitePlayerDetail->id,
                "playerBlackId" => $blackPlayerDetail->id,
                "playerWhiteName" => $whitePlayerDetail->id,
                "playerBlackName" => $blackPlayerDetail->id,

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

        return view('twoPlayerPlayGround', compact('data'));
    }
}
