<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Matche;
use App\Models\stockfish_matche;
use App\Models\Move;
use App\Models\User;
use DateTime;

class MatchController extends Controller
{
    public function redirectEnginePlayGround($matchNumber){

        $userInfo = auth()->user();

        //match and moves details
        $requestedMatch = stockfish_matche::where('id', '=', $matchNumber)->first();

        //if requested match does not exist
        if($requestedMatch == null){
            return redirect()->route('playView');
        }

        $numberOfMoves = Move::where('matchNumber', '=', $matchNumber)->get();
        
        $playerId = $requestedMatch->playerId;

        //Make sure the user playing match is just continuing
        if($userInfo->id == $playerId){
            //Own user is accessing

            $whitePlayerId;
            $whitePlayerName;
            $blackPlayerName;
            $blackPlayerId;

            $playerName = User::where('id', '=', $requestedMatch->playerId)->first();

            if($requestedMatch->stockfishColor == 'w'){
                $whitePlayerName = "Stockfish";
                $whitePlayerId = "Stockfish";

                $blackPlayerName = $playerName->name;
                $blackPlayerId = $playerName->id;
            }
            else{
                $whitePlayerName = $playerName->name;
                $whitePlayerId = $playerName->id;

                $blackPlayerName = "Stockfish";
                $blackPlayerId = "Stockfish";
            }

            //initial starting of match
            if(count($numberOfMoves) == 0){
            // dd($whitePlayerId);

                // $userDetails, $playerWhiteId, $playerWhiteName, $playerBlackId, $playerBlackName, $matchType, $matchNumber
                return MatchController::initialGameStarting($userInfo, $whitePlayerId, $whitePlayerName, $blackPlayerId, $blackPlayerName, $requestedMatch->level, $requestedMatch->id);
            }
            //player wants to continue match again
            else if($numberOfMoves != null && $requestedMatch->gameStatus == "playing"){

            }
            //player accessing gameover matches
            else if($numberOfMoves != null && $requestedMatch->gameStatus == "over"){

                return redirect()->route('playView');
            }


        }
        else{
            //Some other user is accessing
            return redirect()->route('playView');
        }
    }
    public function insertEngineMatchDetails(Request $request){

        $postData = $request->all();
        $matchNumber = MatchController::saveMatchDetails($request['playerId'], $request['playerColor'], $request['stockfishColor'], $request['level']);

        echo $matchNumber;
    }

    public function saveMatchDetails($playerId,  $playerColor, $stockfishColor, $level){

        $currentDateTime = new DateTime();
        $currentTime = $currentDateTime->format('Y-m-d H:i:s');

        $match = stockfish_matche::create([
            'playerId' => $playerId,
            'playerColor' => $playerColor,
            'stockfishColor' => $stockfishColor,
            'level' => $level,
            'gameStatus' => "playing"
        ]);

        return $match->id;
    }

    //Start game from beginning
    public function initialGameStarting($userDetails, $playerWhiteId, $playerWhiteName, $playerBlackId, $playerBlackName, $matchType, $matchNumber){

        $startingfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        $data = array();
        $data = [
            "playerInfomation" => [
                "yourId" => $userDetails->id,
                "yourName" => $userDetails->name,
                "playerWhiteId" => $playerWhiteId,
                "playerWhiteName" => $playerWhiteName,
                "playerBlackId" => $playerBlackId,
                "playerBlackName" => $playerBlackName,
                "whitePlayerImage" => "",
                "blackPlayerImage" => ""

            ],
            "boardDetails" => [
                "startingFenPosition" => $startingfenPos,
                "allfinalFenPosition" => [],
                "allMove" => [],
                "castelDetails" => MatchController::returnInitialCastelDetails()
            ],
            "gameDetails" => [
                "level" => $matchType,
                "channelNumber" => $matchNumber,
                "gameType" => "stockfish"
            ]
        ];

        return view('responsive.engineplayground', compact('data'));
    }

    public function returnInitialCastelDetails(){

        return [
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
        ];
    }
}
