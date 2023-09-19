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
use App\Models\Puzzle;
use App\Models\CompletedPuzzle;
use Illuminate\Support\Facades\DB;
use DateTime;

class MatchController extends Controller
{

    public function updateCompletedPuzzle(Request $request){

        $postData = $request->all();
        $userDetails = auth()->user();

        $completedPuzzleRecords = DB::table('completed_puzzles')
        ->where('playerId', $userDetails->id)
        ->where('puzzleId', $postData['puzzleNumber'])
        ->get()
        ->toArray();

        if(count($completedPuzzleRecords) == 0){
            $completedPuzzle = CompletedPuzzle::create([
                'playerId' => $userDetails->id, 
                'puzzleId' => $postData['puzzleNumber'],
                'status' => "completed",
            ]);
        }

    }
    public function playPuzzlesWithEngine($puzzleNumber){

        $userDetails = auth()->user();
        $requestedPuzzle = Puzzle::where('id', '=', $puzzleNumber)->first();

        if($requestedPuzzle == null){
            return redirect()->route('playPuzzleView'); 
        }
        $startingfenPos = $requestedPuzzle->fenPosition;

        $fenExploded = explode(' ', $startingfenPos);

        $whitePlayerId;
        $whitePlayerName;
        $whitePlayerImage;
        $blackPlayerName;
        $blackPlayerId;
        $blackPlayerImage;
        
        //If player is white
        if($fenExploded[1] == 'w'){
            $whitePlayerId = $userDetails->id;
            $whitePlayerName = $userDetails->name;
            $whitePlayerImage = $userDetails->image;
            $blackPlayerName = "Stockfish";
            $blackPlayerId = "Stockfish";
            $blackPlayerImage = "Stockfish.png";
        }
        //if player is black
        else{
            $whitePlayerId = "Stockfish";
            $whitePlayerName = "Stockfish";
            $whitePlayerImage = "Stockfish.png";
            $blackPlayerName  = $userDetails->name;
            $blackPlayerId  = $userDetails->id;
            $blackPlayerImage = $userDetails->image;
        }

        $data = array();

        $data = [
            "playerInfomation" => [
                "yourId" => $userDetails->id,
                "yourName" => $userDetails->name,
                "playerWhiteId" => $whitePlayerId,
                "playerWhiteName" => $whitePlayerName,
                "whitePlayerImage" => $whitePlayerImage,

                "playerBlackId" => $blackPlayerId,
                "playerBlackName" => $blackPlayerName,
                "blackPlayerImage" => $blackPlayerImage

            ],
            "boardDetails" => [
                "startingFenPosition" => $startingfenPos,
                "allfinalFenPosition" => [],
                "allMove" => [],
                "castelDetails" => MatchController::returnCastelDetails($startingfenPos)
            ],
            "gameDetails" => [
                "level" => 12,
                "channelNumber" => $puzzleNumber,
                "gameType" => "puzzle",
                "mateInMove" => $requestedPuzzle->numberOfMoves
            ]
        ];

        return view('responsive.engineplayground', compact('data'));
    }

    public function returnCastelDetails($fenPosition)
    {
        $castelDetails = [
            'whiteKingMoved' => true,
            'whiteKingChecked' => true,
            'whiteKingSideRookMoved' => true,
            'whiteKingSideRookCaptured' => true,
            'whiteKingSideSquaresChecked' => true,
            'whiteQueenSideRookMoved' => true,
            'whiteQueenSideRookCaptured' => true,
            'whiteQueenSideSquaresChecked' => true,
            'blackKingMoved' => true,
            'blackKingChecked' => true,
            'blackKingSideRookMoved' => true,
            'blackKingSideRookCaptured' => true,
            'blackKingSideSquaresChecked' => true,
            'blackQueenSideRookMoved' => true,
            'blackQueenSideRookCaptured' => true,
            'blackQueenSideSquaresChecked' => true,
        ];
    
        $castelPerms = explode(" ", $fenPosition)[2];
    
        for ($i = 0; $i < strlen($castelPerms); $i++) {
            $char = $castelPerms[$i];
            if ($char == 'K') {
                $castelDetails['whiteKingMoved'] = false;
                $castelDetails['whiteKingChecked'] = false;
                $castelDetails['whiteKingSideRookMoved'] = false;
                $castelDetails['whiteKingSideRookCaptured'] = false;
                $castelDetails['whiteKingSideSquaresChecked'] = false;
            } elseif ($char == 'Q') {
                $castelDetails['whiteKingMoved'] = false;
                $castelDetails['whiteKingChecked'] = false;
                $castelDetails['whiteQueenSideRookMoved'] = false;
                $castelDetails['whiteQueenSideRookCaptured'] = false;
                $castelDetails['whiteQueenSideSquaresChecked'] = false;
            } elseif ($char == 'k') {
                $castelDetails['blackKingMoved'] = false;
                $castelDetails['blackKingChecked'] = false;
                $castelDetails['blackKingSideRookMoved'] = false;
                $castelDetails['blackKingSideRookCaptured'] = false;
                $castelDetails['blackKingSideSquaresChecked'] = false;
            } elseif ($char == 'q') {
                $castelDetails['blackKingMoved'] = false;
                $castelDetails['blackKingChecked'] = false;
                $castelDetails['blackQueenSideRookMoved'] = false;
                $castelDetails['blackQueenSideRookCaptured'] = false;
                $castelDetails['blackQueenSideSquaresChecked'] = false;
            }
        }
    
        return $castelDetails;
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
                $whitePlayerImage = "Stockfish.png";

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
                $blackPlayerImage = "Stockfish.png";
            }

            return MatchController::initialGameStarting($userInfo, $whitePlayerId, $whitePlayerName, $whitePlayerImage, $blackPlayerId, $blackPlayerName, $blackPlayerImage, $requestedMatch->level, $requestedMatch->id);

        }
        else{
            //Some other user is accessing
            return redirect()->route('playView');
        }
    }

    public function insertPuzzleDetails(Request $request){

        //Will receive position and checkmate number
        $postData = $request->all();

        //just search if the puzzle exist of similar fenPos
        //else insert

        $fenPos = $postData['fenPos'];
        $numberOfMove = $postData['numberOfMoves'];

        $searchFenPos = Puzzle::where('fenPosition', '=', $fenPos)->first();

        //Find if fenPos Exist or not
        if($searchFenPos == null){
            $newPuzzle = Puzzle::create([
                'fenPosition' => $fenPos,
                'category' => "checkmate",
                'numberOfMoves'=> $numberOfMove,
            ]);
        }
    }

    public function analysisMatchDetails($matchType, $matchNumber){

        //Receives all the matches from database
        $allFenPositions = MatchController::getAllFenPositionDetails($matchType, $matchNumber);
        
        $allMoves;
        $userInformation;

        //Now get all the details of player
        //PLayer Details in stockfish_match table
        if($matchType == "Stockfish"){

            $allMoves = StockfishMove::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('move')
            ->toArray();

            //find color of player
            $playerId = stockfish_matche::where('id' , '=', $matchNumber)->value('playerId');
            $playerColor = stockfish_matche::where('id' , '=', $matchNumber)->value('playerColor');
            $playerDetails = User::where('id', '=', $playerId)->first();

            if($playerColor == 'w'){
                $userInformation = [
                    "blackPlayerName" => "Stockfish",
                    "blackPlayerImage" => "Stockfish.png",
                    "whitePlayerName" => $playerDetails->name,
                    "whitePlayerImage" => $playerDetails->image
                ];
            }
            else{
                $userInformation = [
                    "blackPlayerName" => $playerDetails->name,
                    "blackPlayerImage" => $playerDetails->image,
                    "whitePlayerName" => "Stockfish",
                    "whitePlayerImage" => "Stockfish.png"
                ];
            }
            
            
        }
        //Players Details in match table
        else{
            $allMoves = Move::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('move')
            ->toArray();

            $matchDetail = Matche::where('id', '=', $matchNumber)->first();
            $whitePlayerDetails = User::where('id','=' , $matchDetail->whitePlayer)->first();
            $blackPlayerDetails = User::where('id', '=' , $matchDetail->blackPlayer)->first();

            $blackPlayerImage = $blackPlayerDetails->image;

            $userInformation = [
                "blackPlayerName" => $blackPlayerDetails->name,
                "blackPlayerImage" => $blackPlayerDetails->image,
                "whitePlayerName" => $whitePlayerDetails->name,
                "whitePlayerImage" => $whitePlayerDetails->image
            ];
        }

        $data = [
            'finalFenPositions' => $allFenPositions ,
            'allMoves' => $allMoves,
        ];

        return view('responsive.analysismatch', compact('data'), compact('userInformation'));
        
    }
    
    public function getAllFenPositionDetails($matchType, $matchNumber){
        $startingfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        $allFinalFenPosInDB;

        $userInformation;

        $data = [];

        if($matchType == "Stockfish"){
            $allFinalFenPosInDB = StockfishMove::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('finalFenPosition')
            ->toArray();

        }
        else{
            $allFinalFenPosInDB = Move::where('matchNumber', $matchNumber)
            ->orderBy('id', 'asc')
            ->pluck('finalFenPosition')
            ->toArray();
        }

        if (is_null($allFinalFenPosInDB)) {

            $data[] = $startingfenPos;
        } else {

            array_unshift($data, $startingfenPos);
            $data = array_merge($data, $allFinalFenPosInDB);
        }

        return $data;
    }

    public function updatePlayerRating(Request $request){

        $postData = $request->all();

        $match = Matche::where('id', '=', $postData["matchId"])->first();

        $whitePlayerRating = Rating::where('id', '=', $postData["playerWhiteId"])->first();
        $blackPlayerRating = Rating::where('id', '=', $postData["playerBlackId"])->first();
        
        //update rating
        if($postData["gameType"] == 'blitz'){
            $whitePlayerRating->blitz = $postData['updatedWhiteRating'];
            $blackPlayerRating->blitz = $postData['updatedBlackRating'];
        }
        else if($postData["gameType"] == 'bullet'){
            $whitePlayerRating->bullet = $postData['updatedWhiteRating'];
            $blackPlayerRating->bullet = $postData['updatedBlackRating'];
        }
        else{
            $whitePlayerRating->classic = $postData['updatedWhiteRating'];
            $blackPlayerRating->classic = $postData['updatedBlackRating'];
        }
        //update game data
        $whitePlayerRating->save();
        $blackPlayerRating->save();

        $match->gameStatus = "over";
        $match->save();
    }

    public function onlineMultiplayer(Request $request, $onlineChannelNumber){

        //Logged User or currently requesed user
        $loggedUser = auth()->user();

        $currentMatchDetail = Matche::where('id', '=', $onlineChannelNumber)->first();

        //Match does not exist
        if($currentMatchDetail == null){
            return redirect()->route('playView');
        }

        $playerWhite = User::where('id', '=', $currentMatchDetail->whitePlayer)->first();
        $playerBlack = User::where('id', '=', $currentMatchDetail->blackPlayer)->first();

        //Some person trying to access is either black or white player
        if($playerWhite->id == $loggedUser->id || $playerBlack->id == $loggedUser->id){

            $gameType = $currentMatchDetail->gameType;
            
            $playerWhiteRating = Rating::where('id', '=', $currentMatchDetail->whitePlayer)->value($gameType);
            $playerBlackRating = Rating::where('id', '=', $currentMatchDetail->blackPlayer)->value($gameType);

            //check if position is already checkmated
            //get the final move and check its length is equal to 4 or 5
            $finalMoveInDB = Move::where('matchNumber', $currentMatchDetail->id)
            ->orderBy('id', 'desc')
            ->value('move');

            //Already move has been played
            if($finalMoveInDB != null){

                //Make move to array and check its length to find out weather match is over or not
                //if checkmated or draw or match over by time redirect to main page
                $moveArray = explode(' ', $finalMoveInDB);

                //If match is already draw or checkmate
                if(count($moveArray) == 4 || count($moveArray) == 5){
                    return redirect()->route('playView');
                }

                //check remaining time
                $whiteRemainingTime = Move::where('matchNumber', $currentMatchDetail->id)
                ->orderBy('id', 'desc')
                ->value('remainingTimeWhite');

                $blackRemainingTime = Move::where('matchNumber', $currentMatchDetail->id)
                ->orderBy('id', 'desc')
                ->value('remainingTimeBlack');

                $moveInsertedDate = Move::where('matchNumber', $currentMatchDetail->id)
                ->orderBy('id', 'desc')
                ->value('recordedTime');

                //If time is over of any two players
                if(MatchController::findFinalTime($whiteRemainingTime, $moveInsertedDate) < 1 || MatchController::findFinalTime($blackRemainingTime, $moveInsertedDate) < 1){
                    
                    return redirect()->route('playView');
                }

                //If game requested is not over and time is still remaining get all moves and finalFenPositions
                $allMovesInDB = Move::where('matchNumber', $currentMatchDetail->id)
                ->orderBy('id', 'asc')
                ->pluck('move')
                ->toArray();

                $allFinalFenPosInDB = Move::where('matchNumber', $currentMatchDetail->id)
                ->orderBy('id', 'asc')
                ->pluck('finalFenPosition')
                ->toArray();

                //Find which player made final move
                $lastfinalFenRecorded = Move::where('matchNumber', '=', $onlineChannelNumber)
                ->orderBy('id', 'desc')
                ->value('finalFenPosition');

                $lastFenArray = explode(" ", trim($lastfinalFenRecorded));
                $playerColorRecentlyMoved = $lastFenArray[1];

                //just reduce time of that player who did not made move
                if($playerColorRecentlyMoved == 'w'){
                    $whiteRemainingTime = MatchController::findFinalTime($whiteRemainingTime, $moveInsertedDate);
                }
                else{
                    $blackRemainingTime = MatchController::findFinalTime($blackRemainingTime, $moveInsertedDate);
                }

                $data = MatchController::generateGameDataArray($loggedUser, $playerWhite, $playerBlack, $playerWhiteRating, $playerBlackRating, $whiteRemainingTime, $blackRemainingTime, $onlineChannelNumber, $allFinalFenPosInDB, $allMovesInDB, $gameType);
    
                return view('responsive.onlinechessground', compact('data'));
            }
            //The Game has just been started
            else{

                $whiteRemainingTime;
                $blackRemainingTime;

                //find initially played moves and final positions
                if($gameType == 'blitz'){
                    $whiteRemainingTime = MatchController::findFinalTime( 1 * 60, $currentMatchDetail->recordedTime);
                    $blackRemainingTime = 1 * 60;
                }
                else if($gameType == 'bullet'){
                    $whiteRemainingTime = MatchController::findFinalTime( 3 * 60, $currentMatchDetail->recordedTime);
                    $blackRemainingTime = 3 * 60;
                }
                else if($gameType == 'classic'){
                    $whiteRemainingTime = MatchController::findFinalTime( 10 * 60, $currentMatchDetail->recordedTime);
                    $blackRemainingTime = 10 * 60;
                }

                if($whiteRemainingTime < 1){
                    return redirect()->route('playView');
                }

                //Get data if match has just started
                $data = MatchController::generateGameDataArray($loggedUser, $playerWhite, $playerBlack, $playerWhiteRating, $playerBlackRating, $whiteRemainingTime, $blackRemainingTime, $onlineChannelNumber, [], [], $gameType);
    
                return view('responsive.onlinechessground', compact('data'));
            }
        }
        else{
            return redirect()->route('playView');
        }
    }

    public function findFinalTime($remaining, $moveInsertedDate){
        $currentDateTime = new DateTime();
        $currentTime = $currentDateTime->format('Y-m-d H:i:s');
        $gameRecorded = DateTime::createFromFormat('Y-m-d H:i:s', $moveInsertedDate);

        $interval = $currentDateTime->diff($gameRecorded);

        $secondDiff = $interval->s;
        $secondDiff+= $interval->i * 60;
        $secondDiff += $interval->h * 3600;

        return ($remaining - $secondDiff);
    }

    public function generateGameDataArray($loggedUser, $playerWhite, $playerBlack, $playerWhiteRating, $playerBlackRating, $whiteRemainingTime, $blackRemainingTime, $onlineChannelNumber, $allfinalFenPositions, $allMoves, $gameType) {

        $startingfenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        $data = [
            "playerInfomation" => [
                "yourId" => $loggedUser->id,
                "yourName" => $loggedUser->name,
                "playerWhiteId" => $playerWhite->id,
                "playerWhiteName" => $playerWhite->name,
                "playerWhiteRating" => $playerWhiteRating,
                "playerBlackId" => $playerBlack->id,
                "playerBlackName" => $playerBlack->name,
                "playerBlackRating" => $playerBlackRating,
                "whitePlayerImage" => $playerWhite->image,
                "blackPlayerImage" => $playerBlack->image
            ],
            "boardDetails" => [
                "startingFenPosition" => $startingfenPos,
                "whiteRemainingTime" => $whiteRemainingTime,
                "blackRemainingTime" => $blackRemainingTime,
                "allfinalFenPosition" => $allfinalFenPositions,
                "allMove" => $allMoves,
                "castelDetails" => MatchController::returnInitialCastelDetails()
            ],
            "gameDetails" => [
                "channelNumber" => $onlineChannelNumber,
                "gameType" => $gameType
            ]
        ];

        return $data;
    }

    public function broadCastPlayerMove(Request $request) {

        $postData = $request->all();

        // Broadcast the event with the data
        event(new PlayerMadeMove($postData));
    
        return response()->json(['message' => 'Event broadcasted successfully', 'data' => $postData]);
    }

    public function recordMoveInDB(Request $request){

        $postData = $request->all();

        $currentDateTime = new DateTime();
        $time = $currentDateTime->format('Y-m-d H:i:s');

        $match = Move::create([
            'matchNumber' => $postData['matchNumber'],
            'startingFenPosition' => $postData['startingFenPosition'],
            'finalFenPosition'=> $postData['finalFenPosition'],
            'move' => $postData['move'],
            'remainingTimeBlack' => $postData['remainingTimeBlack'],
            'remainingTimeWhite' => $postData['remainingTimeWhite'],
            'recordedTime' => $time
        ]);
    }

    public function broadCastPlayerMessage(Request $request){

        $postData = $request->all();

        event(new PlayerMessage($postData['channelNumber'], $postData['id'], $postData['msg']));
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