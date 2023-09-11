<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rating;

class UserNavigationController extends Controller
{
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

    public function gameAnalysisView(){
        $userInfo = auth()->user();
        return view('responsive.analysis', compact('userInfo'));
    }
}
