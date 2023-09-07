<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;
use App\Models\Move;
use Session;
use DateTime;
use Illuminate\Support\Facades\DB;


class UserInterfaceController extends Controller
{
    public function dashboardView(){

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

    public function playView(){
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

    public function level1Black(){

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

    public function level1White(){

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

    public function onlineMultiplayer(Request $request, $onlineChannelNumber){

        $matchDetails = Matche::where('id', '=', $onlineChannelNumber)->first();

        if($matchDetails->gameStatus == "over"){
            return redirect()->route('playView');
        }

        $whitePlayerId = $matchDetails->whitePlayer;
        $blackPlayerId = $matchDetails->blackPlayer;

        $whitePlayerDetail = User::where('id', '=', $whitePlayerId)->first();
        $blackPlayerDetail = User::where('id', '=', $blackPlayerId)->first();

        $loggedUser = auth()->user();
        $yourDetail = User::where('id', '=', $loggedUser->id)->first();

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

        $data = array();
        $data = [
            "game" => "onlineMatch",
            "gameType" => $matchDetails->gameType,
            "channelNumber" => $onlineChannelNumber,
            "playerWhiteRating" => $whiteRating,
            "playerBlackRating" => $blackRating,
            "whiteRemainingTime" => $whiteRemainingTime,
            "blackRemainingTime" => $blackRemainingTime,
            "apiObject" => [
                "startingFenPosition" => $startingfenPos,
                "finalFenPosition" => $finalfenPos,
                "yourId" => $loggedUser->id,
                "yourName" => $loggedUser->name,
                "playerWhiteId" => $whitePlayerDetail->id,
                "playerBlackId" => $blackPlayerDetail->id,
                "playerWhiteName" => $whitePlayerDetail->name,
                "playerBlackName" => $blackPlayerDetail->name,
                "currentMove" => $move,

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

    public function leaderBoardView(){

        $topBlitzPlayer = UserinterfaceController::findTopPlayers("blitz");
        $topClassicPlayer = UserinterfaceController::findTopPlayers("classic");
        $topBulletPlayer = UserinterfaceController::findTopPlayers("bullet");

        $data = [
            "blitz" => $topBlitzPlayer,
            "bullet" => $topBulletPlayer,
            "classic" => $topClassicPlayer
        ];

        return view('leaderboard', compact('data'));
    }

    public function findTopPlayers($gameType){

        $topPlayer = User::join('ratings', 'users.id', '=', 'ratings.userId')
        ->select('users.name', 'ratings.' . $gameType)
        ->addSelect(User::raw('(
            SELECT COUNT(*) 
            FROM matches 
            WHERE (matches.whitePlayer = users.id OR matches.blackPlayer = users.id) 
            AND matches.gameType = "'.$gameType.'"
        ) as total_matches_played'))
        ->take(5)
        ->get();

        return $topPlayer;
    }

    public function getUserGameData(){

        // Get the logged-in user's ID
        $loggedUser = auth()->user();
        $userId = $loggedUser->id;

        $top10MatchesPlayed = Matche::where(function ($query) use ($userId) {
            $query->where('whitePlayer', $userId)
                ->orWhere('blackPlayer', $userId);
        })->orderBy('id', 'desc')->take(10)->get();


        $data = [];

        $counter = 0;
        foreach ($top10MatchesPlayed as $match) {

            $whitePlayerDetail = User::find($match->whitePlayer);
            $blackPlayerDetail = User::find($match->blackPlayer);

            $finalFenPos = UserInterfaceController::getEndingFenPosition($match->id);

            if($finalFenPos == null){
                $finalFenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
            }

            if($userId == $match->whitePlayer){
                $yourColor = 'w';
            }
            else{
                $yourColor = 'b';
            }
             

            $matchData = [
                'matchId' => $match->id,
                'whitePlayerName' => $whitePlayerDetail->name,
                'blackPlayerName' => $blackPlayerDetail->name,
                'gameType' => $match->gameType,
                'endingFenPosition' => $finalFenPos,
                'totalNumberOfMoves' => UserInterfaceController::getTotalNumberOfMoves($match->id),
                "yourColor" => $yourColor
            ];

            $data[$counter] = $matchData;

            $counter++;            
        }


        return view('Analysis', compact('data'));
    }

    public function getEndingFenPosition($matchNumber){

        $finalFenPosition = DB::table('moves')
        ->select('finalFenPosition')
        ->where('matchNumber', $matchNumber)
        ->orderBy('id', 'desc')
        ->limit(1)
        ->value('finalfenPosition');

        return $finalFenPosition;
    }

    public function getTotalNumberOfMoves($matchNumber){

        $totalMoves = Move::where('matchNumber', $matchNumber)->count();

        return $totalMoves;
    }

    public function analysisInformation($matchId){

        $loggedUser = auth()->user();
        $userId = $loggedUser->id;

        $playerColor;

        $matchDetail = Matche::where('id', $matchId)->first();

        if($matchDetail->blackPlayer == $userId){
            $playerColor = 'b';
        }
        else{
            $playerColor = 'w';
        }

        $data = Move::where('matchNumber', $matchId)
            ->orderBy('id', 'asc')
            ->get(['finalfenPosition', 'move']);

        return view('matchAnalysis', compact('data', 'playerColor'));
        
    }

    public function playPuzzleView(){
     
        return view('Puzzles');
    }

    public function addPuzzleView(){

        return view('AddPuzzles');
    }
}
