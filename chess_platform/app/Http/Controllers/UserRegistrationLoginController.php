<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Player;
use Hash;
use Session;

class UserRegistrationLoginController extends Controller
{
    //Shows login form
    public function playerLoggedInForm(){
        return view("forms.login_form", ["pageTitle" => "Player Login Form"]);
    }

    //Shows player registration form
    public function playerRegisteredForm(){
        return view("forms.registration_form", ["pageTitle" => "Player Registration Form"]);
    }

    //To register new users in database
    public function playerRegistration(Request $player_info){

        $player_info->validate([
            'name' => 'required',
            'email' => 'email|unique:players|required',
            'password' => 'required|min:8|max:16'
        ]);

        $player = new Player();

        $player->name = $player_info->name;
        $player->email = $player_info->email;
        $player->password = Hash::make($player_info->password);

        $action = $player->save();

        if($action){
            return back()->with('PASSED_MESSAGE', 'Player Registration Successful');
        }
        else{
            return back()->with('FAILED_MESSAGE', 'Player Registered Failed');
        }
    }

    //To check the valid users
    public function playerLoggedIn(Request $request){

        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $player = Player::where('email' , '=', $request->email)->first();

        echo $player;

        if($player){

            if(Hash::check($request->password, $player->password)){
                $request->session()->put('playerId', $player->ID);
                return redirect('dashboard');
            }
            else{
                return back()->with('FAILED_MESSAGE', 'INVALID PASSWORD');
            }
        }
        else{
            return back()->with('FAILED_MESSAGE', 'EMAIL NOT REGISTERED');
        }
    }

    public function playerLoggedOut(){
        if(Session::has('playerId')){
            Session::pull('playerId');
            return redirect('playerLogin');
        }
    }

    public function dashboard(){
        $data = array();
        if(Session::has('playerId')){
            $data = Player::where('id', '=', Session::get('playerId'))->first();

        }
        return view('NavigationLayouts.Dashboard.dashboard',
                    ["pageTitle" => "Player Dashboard"],
                    compact('data'));
    }
}