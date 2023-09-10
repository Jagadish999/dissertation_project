<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserNavigationController extends Controller
{
    public function dashboardView(){

        $userInfo = auth()->user();

        return view('responsive.dashboard', compact('userInfo'));
    }

    public function playView(){
        $userInfo = auth()->user();
        return view('responsive.play', compact('userInfo'));
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
