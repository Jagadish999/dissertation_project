<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;
use App\Models\Matche;
use App\Models\Move;
use App\Models\Puzzle;
use App\Models\stockfish_matche;
use App\Models\StockfishMove;
use App\Models\CompletedPuzzle;
use Illuminate\Support\Facades\DB;

class UserNavigationController extends Controller
{

    public function dashboardView()
    {
        
        $userInfo = auth()->user();
        $rating = Rating::where('userId', '=', $userInfo->id)->first();

        //Total Number of Match Played
        $totalMatchesPlayed = Matche::where(function ($query) use ($userInfo) {
            $query->where('whitePlayer', $userInfo->id)
                  ->orWhere('blackPlayer', $userInfo->id);
        })->count();

        //Total number of blitz match played
        $totalBlitzMatches = Matche::where(function ($query) use ($userInfo) {
            $query->where('whitePlayer', $userInfo->id)
                  ->orWhere('blackPlayer', $userInfo->id);
        })->count();
    
        $totalBlitzMatches = Matche::where(function ($query) use ($userInfo) {
            $query->where(function ($subquery) use ($userInfo) {
                $subquery->where('whitePlayer', $userInfo->id)
                         ->orWhere('blackPlayer', $userInfo->id);
            })
            ->where('gameType', 'blitz');
        })->count();

        $totalBulletMatches = Matche::where(function ($query) use ($userInfo) {
            $query->where(function ($subquery) use ($userInfo) {
                $subquery->where('whitePlayer', $userInfo->id)
                         ->orWhere('blackPlayer', $userInfo->id);
            })
            ->where('gameType', 'bullet');
        })->count();

        $totalClassicMatches = Matche::where(function ($query) use ($userInfo) {
            $query->where(function ($subquery) use ($userInfo) {
                $subquery->where('whitePlayer', $userInfo->id)
                         ->orWhere('blackPlayer', $userInfo->id);
            })
            ->where('gameType', 'classic');
        })->count();
    

        $totalPuzzlesSolved = CompletedPuzzle::where('playerId', $userInfo->id)->count();
    
        $data = [
            "id" => $userInfo->id,
            "fullname" => $userInfo->name,
            "email" => $userInfo->email,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic,
            "image" => $userInfo->image,
            "totalMatchesPlayed" => $totalMatchesPlayed,
            "totalBlitzMatches" => $totalBlitzMatches,
            "totalBulletMatches" => $totalBulletMatches,
            "totalClassicMatches" => $totalClassicMatches,
            "totalPuzzlesSolved" => $totalPuzzlesSolved,
        ];
    
        return view('responsive.dashboard', compact('data'));
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

    public function leaderBoardView(){

        $title = 'Leaderboard';

        $topBlitzPlayer = UserNavigationController::findTopPlayers("blitz", 4);
        $topClassicPlayer = UserNavigationController::findTopPlayers("classic", 4);
        $topBulletPlayer = UserNavigationController::findTopPlayers("bullet", 4);

        $data = [
            "blitz" => $topBlitzPlayer,
            "bullet" => $topBulletPlayer,
            "classic" => $topClassicPlayer
        ];

        return view('responsive.leaderboard', compact('data'), compact('title'));
    }

    public function topPlayersGameType($gameType){
        $title = ucfirst($gameType) . ' Leaderboard';
        $topPlayerInfos = UserNavigationController::findTopPlayers($gameType, 10);
        return view('responsive.specificleaderboard', compact('topPlayerInfos'), compact('title'));
    }

    public function findTopPlayers($gameType, $number){

        $topPlayers = User::join('ratings', 'users.id', '=', 'ratings.userId')
        ->select('users.id', 'users.name', 'ratings.' . $gameType, 'users.image')
        ->orderByDesc('ratings.' . $gameType)
        ->take($number)
        ->get();

        foreach ($topPlayers as &$player) {
            $totalMatchesPlayed = Matche::where(function ($query) use ($player) {
                $query->where('whitePlayer', $player->id)
                    ->orWhere('blackPlayer', $player->id);
            })
            ->where('gameType', $gameType)
            ->count();

            $player->totalGamesPlayed = $totalMatchesPlayed;
        }
    
        return $topPlayers;
    }
    


    public function editProfileView(){
        $user = auth()->user();


        return view('responsive.editprofile', compact('user'));
    }

    public function playPuzzleView(){
        $userInfo = auth()->user();

        $allPuzzlePositions = Puzzle::where('category' , '=', 'checkmate')
        ->orderBy('numberOfMoves', 'asc')
        ->get();

        $completedPuzzleIds = DB::table('completed_puzzles')
        ->where('playerId', $userInfo->id)
        ->pluck('puzzleId')
        ->toArray();

        foreach ($allPuzzlePositions as $puzzle) {
            $puzzle->completed = in_array($puzzle->id, $completedPuzzleIds);
        }

        return view('responsive.puzzle', compact('allPuzzlePositions'));
    }

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

    public function addPuzzleView(){
        $userInfo = auth()->user();
        return view('responsive.addpuzzle', compact('userInfo'));
    }
}
