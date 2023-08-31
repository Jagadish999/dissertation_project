<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MatchMaking;
use App\Events\PlayerRedirection;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;

class MatchTypeController extends Controller
{
    public function MatchSelected(Request $request)
    {
        $postData = $request->all();

        echo json_encode($postData);

        event(new MatchMaking(json_encode($postData)));
    }

    public function broadCastPlayerMatching(Request $request){

        $postData = $request->all();

        echo json_encode($postData);

        $player1Id = $postData['player1Id'];
        $player2Id = $postData['player2Id'];
        $gameType = $postData['gameType'];

        $matchNumber = MatchTypeController::saveMatchingDetails($player1Id, $player2Id, $gameType);

        $matchDataToBroadCast = [
            "player1Id" => $player1Id,
            "player2Id" => $player2Id,
            "gameType" => $gameType,
            "channelId" => $matchNumber
        ];

        event(new PlayerRedirection($matchDataToBroadCast));

    }

    public function saveMatchingDetails($player1Id, $player2Id, $gameType){

        $randomNum = rand(0, 1);

        if($randomNum == 0){
            $white = $player1Id;
            $black = $player2Id;
        }
        else{
            $white = $player2Id;
            $black = $player1Id;
        }

        $match = Matche::create([
            'whitePlayer' => $white,
            'blackPlayer' => $black,
            'gameType' => $gameType,
            'gameStatus' => "playing",
        ]);

        return $match->id;
    }
}
