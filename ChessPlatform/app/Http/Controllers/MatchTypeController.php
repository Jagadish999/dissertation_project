<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MatchMaking;
use App\Events\PlayerRedirection;
use App\Events\PlayerMadeMove;
use App\Events\PlayerMessage;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;
use App\Models\Move;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\File;

use DateTime;

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

        $currentDateTime = new DateTime();
        $currentTime = $currentDateTime->format('Y-m-d H:i:s');

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
            'recordedTime' => $currentTime
        ]);

        return $match->id;
    }

    public function broadCastPlayerMove(Request $request){

        $postData = $request->all();

        echo json_encode($postData);

        $startingFenPosition = $postData['apiObject']['startingFenPosition'];
        $finalFenPosition = $postData['apiObject']['finalFenPosition'];

        $move = $postData['apiObject']['currentMove'];
        $matchNumber = $postData['channelNumber'];

        $whiteRemainingTime = $postData['whiteRemainingTime'];
        $blackRemainingTime = $postData['blackRemainingTime'];

        MatchTypeController::recordMoveInDB($startingFenPosition, $finalFenPosition, $move, $matchNumber, $whiteRemainingTime, $blackRemainingTime);

        $moveLen = explode(" ", $move);

        event(new PlayerMadeMove($postData));
    }

    public function recordMoveInDB($startingFenPosition, $finalFenPosition, $move, $matchNumber, $whiteRemainingTime, $blackRemainingTime){

        $currentDateTime = new DateTime();
        $time = $currentDateTime->format('Y-m-d H:i:s');

        $match = Move::create([
            'matchNumber' => $matchNumber,
            'startingFenPosition' => $startingFenPosition,
            'finalFenPosition'=> $finalFenPosition,
            'move' => $move,
            'remainingTimeBlack' => $blackRemainingTime,
            'remainingTimeWhite' => $whiteRemainingTime,
            'recordedTime' => $time
        ]);
    }

    public function broadCastPlayerMessage(Request $request){

        $postData = $request->all();

        event(new PlayerMessage($postData['channelNumber'], $postData['name'], $postData['msg']));
    }

    public function updateRating(Request $request){

        $postData = $request->all();

        $match = Matche::where('id', '=', $postData["matchId"])->first();

        if($match->gameStatus == "playing"){

            $whitePlayerRating = Rating::where('id', '=', $postData["playerWhiteId"])->first();
            $blackPlayerRating = Rating::where('id', '=', $postData["playerBlackId"])->first();
            
            //update rating
            if($postData["gameType"] == 'blitz'){
                $whitePlayerRating->blitz = $postData['updatedWhiteId'];
                $blackPlayerRating->blitz = $postData['updatedBlackId'];
            }
            else if($postData["gameType"] == 'bullet'){
                $whitePlayerRating->bullet = $postData['updatedWhiteId'];
                $blackPlayerRating->bullet = $postData['updatedBlackId'];
            }
            else{
                $whitePlayerRating->classic = $postData['updatedWhiteId'];
                $blackPlayerRating->classic = $postData['updatedBlackId'];
            }
            //update game data
            $whitePlayerRating->save();
            $blackPlayerRating->save();

            $match->gameStatus = "over";
            $match->save();
        }
    }
}
