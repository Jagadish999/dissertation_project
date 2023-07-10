<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NavigationPageController extends Controller
{
    public function multiplayer(){
        return view("NavigationLayouts.Multiplayer.multiplayer", ["pageTitle" => "Multiplayer"]);
    }

    public function leaderboards(){
        return view("NavigationLayouts.Leaderboards.leaderboard", ["pageTitle" => "Leaderboards"]);
    }

    public function tournament(){
        return view("NavigationLayouts.Tournament.tournament", ["pageTitle" => "Tournament"]);
    }

    public function profile(){
        return view("NavigationLayouts.Profile.profile", ["pageTitle" => "Player Profile Informations"]);
    }

    public function analysis(){
        return view("NavigationLayouts.Analysis.analysis", ["pageTitle" => "Game Analysis"]);
    }

    public function puzzles(){
        return view("NavigationLayouts.Puzzles.puzzles", ["pageTitle" => "Puzzle Game"]);
    }

    public function classic(){
        return view("NavigationLayouts.Multiplayer.MatchBoard.classic", ["pageTitle" => "Classic Mode"]);
    }
}