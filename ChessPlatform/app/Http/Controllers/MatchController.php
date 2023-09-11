<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MatchMaking;
use App\Events\PlayerRedirection;
use App\Events\PlayerMessage;
use App\Events\PlayerMadeMove;
use App\Models\Matche;
use App\Models\stockfish_matche;
use App\Models\Move;
use App\Models\StockfishMove;
use App\Models\User;
use App\Models\Rating;
use DateTime;

class MatchController extends Controller
{
    public function onlineMultiplayer(Request $request, $onlineChannelNumber){

        //Logged User
        $loggedUser = auth()->user();
        $playerInformation = User::where('id', '=', $loggedUser->id)->first();

        $matchDetails = Matche::where('id', '=', $onlineChannelNumber)->first();

        if($matchDetails->gameStatus == "over"){
            return redirect()->route('playView');
        }

        $whitePlayerId = $matchDetails->whitePlayer;
        $blackPlayerId = $matchDetails->blackPlayer;

        $whitePlayerDetail = User::where('id', '=', $whitePlayerId)->first();
        $blackPlayerDetail = User::where('id', '=', $blackPlayerId)->first();

        $whitePlayerRatingDetail = Rating::where('userId', '=', $whitePlayerId)->first();
        $blackPlayerRatingDetail = Rating::where('userId', '=', $blackPlayerId)->first();

        $currentDateTime = new DateTime();
        $currentTime = $currentDateTime->format('Y-m-d H:i:s');

        $startingfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
        $finalfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";

        $whiteRating;
        $blackRating;

        $whiteRemainingTime;
        $blackRemainingTime;

        $move = null;

        //Find difference between current time and time of recorded gameDetails
        $currentDateTime = new DateTime();
        $currentTime = $currentDateTime->format('Y-m-d H:i:s');
        $gameRecorded = DateTime::createFromFormat('Y-m-d H:i:s', $matchDetails->recordedTime);

        $interval = $currentDateTime->diff($gameRecorded);

        $secondDiff = $interval->s;
        $secondDiff+= $interval->i * 60;
        $secondDiff += $interval->h * 3600;

        //set initial setting of game
        //If reloading in initial time then update white's time
        if($matchDetails->gameType == "blitz"){
            $whiteRating = $whitePlayerRatingDetail->blitz;
            $blackRating = $blackPlayerRatingDetail->blitz;

            $whiteRemainingTime = 1 * 60 - $secondDiff;
            $blackRemainingTime = 1 * 60;

        }
        else if($matchDetails->gameType == "bullet"){
            $whiteRating = $whitePlayerRatingDetail->bullet;
            $blackRating = $blackPlayerRatingDetail->bullet;

            $whiteRemainingTime = 3 * 60 - $secondDiff;
            $blackRemainingTime = 3 * 60;
        }
        else{
            $whiteRating = $whitePlayerRatingDetail->classic;
            $blackRating = $blackPlayerRatingDetail->classic;

            $whiteRemainingTime = 10 * 60 - $secondDiff;
            $blackRemainingTime = 10 * 60;
        }

        //Find whose turn to move
        
        //only update time of player to move

        $currentMove = Move::where('matchNumber', '=', $onlineChannelNumber)
        ->orderBy('id', 'desc')
        ->first();

        //If record not at the starting of match exist of the match
        if($currentMove != null){

            //find whose turn to move
            $currentFen = $currentMove->finalFenPosition;
            $fenParts = explode(" ", trim($currentMove));
            $turnToMove = $fenParts[1];

            //time of last move recorded
            $recordedTimeLastMove = DateTime::createFromFormat('Y-m-d H:i:s', $currentMove->recordedTime);

            //currently remaining time
            $whiteRemainingTime = $currentMove->remainingTimeWhite;
            $blackRemainingTime = $currentMove->remainingTimeBlack;

            //difference between recordedTimeLastMove and current time
            $interval = $currentDateTime->diff($recordedTimeLastMove);
            

            $secondDiff = $interval->s;
            $secondDiff+= $interval->i * 60;
            $secondDiff += $interval->h * 3600;

            //if white turn to move
            if($turnToMove == 'b'){
                $whiteRemainingTime -= $secondDiff;
            }
            //if black turn to move
            else{
                $blackRemainingTime -= $secondDiff;
            }
            

            $startingfenPos = $currentMove->startingFenPosition;
            $finalfenPos = $currentMove->finalFenPosition;

            $move = $currentMove->move;
        }

        $startingfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        $data = array();
        $data = [
            "playerInfomation" => [
                "yourId" => $loggedUser->id,
                "yourName" => $loggedUser->name,
                "playerWhiteId" => $whitePlayerDetail->id,
                "playerWhiteName" => $whitePlayerDetail->name,
                "playerWhiteRating" => $whiteRating,
                "playerBlackId" => $blackPlayerDetail->id,
                "playerBlackName" => $blackPlayerDetail->name,
                "playerBlackRating" => $blackRating,
                "whitePlayerImage" => "",
                "blackPlayerImage" => ""

            ],
            "boardDetails" => [
                "startingFenPosition" => $startingfenPos,
                "whiteRemainingTime" => $whiteRemainingTime,
                "blackRemainingTime" => $blackRemainingTime,
                "allfinalFenPosition" => [],
                "allMove" => [],
                "castelDetails" => MatchController::returnInitialCastelDetails()
            ],
            "gameDetails" => [
                "channelNumber" => $onlineChannelNumber,
                "gameType" => $matchDetails->gameType
            ]
        ];

        return view('responsive.onlinechessground', compact('data'));
    }

    public function redirectEnginePlayGround($matchNumber){

        $userInfo = auth()->user();

        //match and moves details
        $requestedMatch = stockfish_matche::where('id', '=', $matchNumber)->first();

        //if requested match does not exist
        if($requestedMatch == null){
            return redirect()->route('playView');
        }

        $numberOfMoves = StockfishMove::where('matchNumber', '=', $matchNumber)->get();
        
        $playerId = $requestedMatch->playerId;

        //Make sure the user playing match is just continuing
        if($userInfo->id == $playerId){

            //Own user is accessing
            $whitePlayerId;
            $whitePlayerName;
            $whitePlayerImage;
            $blackPlayerName;
            $blackPlayerId;
            $blackPlayerImage;

            $playerName = User::where('id', '=', $requestedMatch->playerId)->first();

            if($requestedMatch->stockfishColor == 'w'){
                $whitePlayerName = "Stockfish";
                $whitePlayerId = "Stockfish";
                $whitePlayerImage = "Stockfish";

                $blackPlayerName = $playerName->name;
                $blackPlayerId = $playerName->id;
                $blackPlayerImage = $playerName->image;
            }
            else{
                $whitePlayerName = $playerName->name;
                $whitePlayerId = $playerName->id;
                $whitePlayerImage = $playerName->image;

                $blackPlayerName = "Stockfish";
                $blackPlayerId = "Stockfish";
                $blackPlayerImage = "Stockfish";
            }

            return MatchController::initialGameStarting($userInfo, $whitePlayerId, $whitePlayerName, $whitePlayerImage, $blackPlayerId, $blackPlayerName, $blackPlayerImage, $requestedMatch->level, $requestedMatch->id);

        }
        else{
            //Some other user is accessing
            return redirect()->route('playView');
        }
    }

        //Start game from beginning
        public function initialGameStarting($userDetails, $playerWhiteId, $playerWhiteName, $playerWhiteImage, $playerBlackId, $playerBlackName, $playerBlackImage, $matchType, $matchNumber){

            //check if match is over or not
            //fetch data form stockfish_moves where id = $matchnumber

            $finalMoveInDB = StockfishMove::where('matchNumber', $matchNumber)
                            ->orderBy('id', 'desc')
                            ->value('move');

            //Already move has been played
            if($finalMoveInDB != null){
                $moveArray = explode(' ', $finalMoveInDB);

                //If match is already draw or checkmate
                if(count($moveArray) == 4 || count($moveArray) == 5){
                    return redirect()->route('playView');
                }
            }

            //If match has already ended player will not reach here

            $allMovesInDB = StockfishMove::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('move')
            ->toArray();

            $allFinalFenPosInDB = StockfishMove::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('finalFenPosition')
            ->toArray();
            
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
                    "whitePlayerImage" => $playerWhiteImage,
                    "blackPlayerImage" => $playerBlackImage
    
                ],
                "boardDetails" => [
                    "startingFenPosition" => $startingfenPos,
                    "allfinalFenPosition" => $allFinalFenPosInDB,
                    "allMove" => $allMovesInDB,
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

    public function recordMovesWithEngine(Request $request) {
        $postData = $request->json()->all(); // Assuming you are receiving JSON data
    
        // Extract the values from the JSON payload
        $matchNumber = $postData['matchNumber'];
        $startingFenPosition = $postData['startingFenPosition'];
        $finalFenPosition = $postData['finalFenPosition'];
        $move = $postData['move'];
    
        // Call the insertMovesPlayed method to insert the data into the database
        $createdMove = MatchController::insertMovesPlayed($matchNumber, $startingFenPosition, $finalFenPosition, $move);
    
        // Return a JSON response indicating success or any other response as needed
        return response()->json(['message' => 'Move recorded successfully', 'move' => $createdMove]);
    }
    
    public function insertMovesPlayed($matchNumber, $startingFenPosition, $finalFenPosition, $move) {
        $move = StockfishMove::create([
            'matchNumber' => $matchNumber,
            'startingFenPosition' => $startingFenPosition,
            'finalFenPosition' => $finalFenPosition,
            'move' => $move,
        ]);
    
        // You can also return the newly created move if needed
        return $move;
    }
    

    public function broadCastPlayerMove(Request $request) {

        $postData = $request->all();
        echo json_encode($postData);

        // Broadcast the event with the data
        event(new PlayerMadeMove($postData));
    
        return response()->json(['message' => 'Event broadcasted successfully', 'data' => $postData]);
    }

    public function insertEngineMatchDetails(Request $request){

        $postData = $request->all();
        $matchNumber = MatchController::saveMatchDetails($request['playerId'], $request['playerColor'], $request['stockfishColor'], $request['level']);

        echo $matchNumber;
    }

    //Saving Stockfish match
    public function saveMatchDetails($playerId,  $playerColor, $stockfishColor, $level){

        $match = stockfish_matche::create([
            'playerId' => $playerId,
            'playerColor' => $playerColor,
            'stockfishColor' => $stockfishColor,
            'level' => $level,
            'gameStatus' => "playing"
        ]);

        return $match->id;
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

    //Create event that player is waiting for another players
    public function MatchSelected(Request $request)
    {
        $postData = $request->all();
        echo json_encode($postData);
        event(new MatchMaking(json_encode($postData)));
    }

    //Now players will enter match in database, event will trigger which will send both players in multiplayer chess playground
    public function broadCastPlayerMatching(Request $request)
    {
        $postData = $request->all();

        echo json_encode($postData);

        $player1Id = $postData['player1Id'];
        $player2Id = $postData['player2Id'];
        $gameType = $postData['gameType'];

        $matchNumber = MatchController::saveMatchingDetails($player1Id, $player2Id, $gameType);

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
}