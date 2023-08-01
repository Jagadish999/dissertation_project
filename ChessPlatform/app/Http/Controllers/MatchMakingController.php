<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Matching;
use App\Models\Rating;
use App\Models\Game;
use App\Events\MatchMaker;
use App\Events\ChessGamePlayApi;
use Illuminate\Support\Facades\DB;
use Session;

class MatchMakingController extends Controller

{
    //Insert data into matching table
    //If data is more than 1 then create matching player a room and make them play matches
    //Player is only one make them hold for some second and if player exters send them in room
    //If only one player for more than 5 sec then return to previous page
    function matchBlitzPlayer(){

        $gameType = "blitz";
        return MatchMakingcontroller::matchMakingOperations($gameType);

    }

    function matchBulletPlayer(){

        $gameType = "bullet";
        return MatchMakingcontroller::matchMakingOperations($gameType);
    }

    function matchClassicPlayer(){
        

        $gameType = "classic";
        return MatchMakingcontroller::matchMakingOperations($gameType);
    }

    function matchMakingOperations($gameType){

        $player = MatchMakingController::makeMatchAssignChannel($gameType);

        if($player == NULL){
            //Insert your data and wait in finding player room
            MatchMakingController::insertUserDetails($gameType);
            $data = array();
            $data = ["channelName" => "MatchPlayerChannel" . session::get('userId')];
            return view('findingPlayer', compact('data'));
        }

        //If player is already waiting insert data in match and get to playerMatch page
        $game = new Game();

        $game->whitePlayer = session::get('userId');
        $game->blackplayer = $player->playerId;
        $game->gameType = $gameType;
        $game->gameChannel = 'GamePlayChannel'.session::get('userId').$player->playerId;

        $game->save();

        //create event for waiting player
        event(new MatchMaker("player found", $player->playerId));

        $res = DB::table('matchings')->where('playerId', $player->Id)->delete();

        return redirect('/whitePlayerFound');
    }

    function insertUserDetails($gameType){

        $rating = Rating::where('userId', '=', session::get('userId'))->first();
        $matching = new Matching();

        $matching->playerId = session::get('userId');
        $matching->gameType = $gameType;
        $matching->rating = $rating[$gameType];
        $matching->waiting = "MatchPlayerChannel" . session::get('userId');

        $res = $matching->save();
    }

    function makeMatchAssignChannel($gameType){

        $rating = Rating::where('userId', '=', session::get('userId'))->first();
    
        $player = Matching::where('playerId', '!=', session::get('userId'))
        ->where('rating', '=', $rating[$gameType])
        ->where('gameType', '=', $gameType)
        ->first();

        return $player;
    }

    function waitingPlayerMatchMaking(){

        $game = Game::where('blackPlayer', '=', session::get('userId'))
        ->orderBy('id', 'desc')
        ->first();

        $data = array();
        $data = ['channelName' => $game->gameChannel];
        
        return view('playerMatch', compact('data'));
    }

    function whitePlayerMatched(){
        $game = Game::where('whitePlayer', '=', session::get('userId'))
        ->orderBy('id', 'desc')
        ->first();

        $data = array();
        $data = ['channelName' => $game->gameChannel];
        
        return view('playerMatch', compact('data'));
    }
}
