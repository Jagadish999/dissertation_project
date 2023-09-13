<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;
use App\Models\Move;
use App\Models\stockfish_matche;
use App\Models\StockfishMove;
use Illuminate\Support\Facades\DB;

class UserNavigationController extends Controller
{
    public function gameAnalysisView(){

        $userInfo = auth()->user();
        $userId = $userInfo->id;

        $top10MatchesOnline = Matche::where(function ($query) use ($userId) {
            $query->where('whitePlayer', $userId)
                ->orWhere('blackPlayer', $userId);
        })->orderBy('id', 'desc')->take(5)->get();

        $allOnlineMatchdata = [];
        $counter = 0;

        foreach ($top10MatchesOnline as $match) {

            $whitePlayerDetail = User::find($match->whitePlayer);
            $blackPlayerDetail = User::find($match->blackPlayer);

            $finalFenPos = UserNavigationController::getEndingFenPosition($match->id);
            $gameContinuable = UserNavigationController::findContinuable($match->id);

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
                'whitePlayerImage' => $whitePlayerDetail->image,
                'blackPlayerName' => $blackPlayerDetail->name,
                'blackPlayerImage' => $blackPlayerDetail->image,
                'gameType' => $match->gameType,
                'endingFenPosition' => $finalFenPos,
                'totalNumberOfMoves' => UserNavigationController::getTotalNumberOfMoves($match->id),
                "yourColor" => $yourColor
            ];

            $allOnlineMatchdata[$counter] = $matchData;

            $counter++;            
        }

        $top10EngineMatches = stockfish_matche::where(function ($query) use ($userId) {
            $query->where('playerId', $userId);
            })->orderBy('id', 'desc')->take(5)->get();

        $allEngineMatches = [];
        $counter = 0;

        foreach ($top10EngineMatches as $match) {

            //Player Detail is from auth information
            $finalFenPos = UserNavigationController::getEndingFenPositionStockfish($match->id);
            $bla = $finalFenPos;
            if($finalFenPos == null){
                $finalFenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
            }
            $yourColor = $match->playerColor;
            $gameContinuable = UserNavigationController::findContinuable($match->id);

            $matchData = [
                'matchId' => $match->id,
                'playerName' => $userInfo->name,
                'playerImage' => $userInfo->image,
                'gameType' => "Stockfish",
                'endingFenPosition' => $finalFenPos,
                'totalNumberOfMoves' => UserNavigationController::getTotalNumberOfMovesStockFish($match->id),
                "yourColor" => $yourColor,
                "continuable" => $gameContinuable,
                "bla" => $bla
            ];

            $allEngineMatches[$counter] = $matchData;

            $counter++;   
        }

        return view('responsive.analysis', compact('allOnlineMatchdata'), compact('allEngineMatches'));
    }

    public function findContinuable($matchNumber){
        $moveArray = DB::table('stockfish_moves')
        ->select('move')
        ->where('matchNumber', $matchNumber)
        ->orderBy('id', 'desc')
        ->limit(1)
        ->value('move');

        $move = explode(' ', $moveArray);

        if(count($move) == 4 || count($move) == 5){
            return false;
        }

        return true;
    }

    public function getTotalNumberOfMoves($matchNumber){

        $totalMoves = Move::where('matchNumber', $matchNumber)->count();
        return $totalMoves;
    }

    public function getTotalNumberOfMovesStockFish($match){

        $totalMoves = StockfishMove::where('matchNumber', $match)->count();
        return $totalMoves;
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

    public function getEndingFenPositionStockfish($matchNumber){
        $finalFenPosition = DB::table('stockfish_moves')
        ->select('finalFenPosition')
        ->where('matchNumber', $matchNumber)
        ->orderBy('id', 'desc')
        ->limit(1)
        ->value('finalfenPosition');

        return $finalFenPosition;
    }


    public function dashboardView(){

        $userInfo = auth()->user();

        return view('responsive.dashboard', compact('userInfo'));
    }

    public function playView(){

        $userInfo = auth()->user();

        $user = User::where('id', '=', $userInfo->id)->first();
        $rating = Rating::where('userId', '=', $userInfo->id)->first();

        $userDetails = [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic
        ];

        return view('responsive.play', compact('userDetails'));
    }

    public function playPuzzleView(){
        $userInfo = auth()->user();
        return view('responsive.puzzle', compact('userInfo'));
    }

    public function addPuzzleView(){
        $userInfo = auth()->user();
        return view('responsive.addpuzzle', compact('userInfo'));
    }

    public function leaderBoardView(){
        $userInfo = auth()->user();
        return view('responsive.leaderboard', compact('userInfo'));
    }
}
