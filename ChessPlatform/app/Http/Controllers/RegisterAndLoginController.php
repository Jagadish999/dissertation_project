<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Rating;
use Session;

class RegisterAndLoginController extends Controller
{

    //Takes email from new users and 
    //Previous users are not beign updated
    function userRegistrationBeginning(Request $user_info){

        $user_info->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);
        
        $user = new User();

        $user->Fullname = $user_info->name;
        $user->Email = $user_info->email;
        $user->Password = $user_info->password;
        $user->role = "Player";

        $result = $user->save();

        if($result){
            $rating = new Rating();

            $tempUser = User::where('email' , '=', $user_info->email)->first();

            $rating->userId = $tempUser->Id;
            $rating->blitz = 400;
            $rating->bullet = 400;
            $rating->classic = 400;

            $rating->save();

            return redirect('login');
        }
        else{
            return back()->with('FAIL', 'ERROR');
        }
    }

    function userLogged(Request $user_info){

        $user_info->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email' , '=', $user_info->email)->first();

        if($user){

            if($user_info->password == $user->Password){

                $user_info->session()->put('userId', $user->Id);
                return redirect('dashboard');
            }
            else{

                return back()->with('FAIL', 'INVALID PASSWORD');
            }
        }
        else{
            return back()->with('FAIL', 'EMAIL NOT REGISTERED');
        }
    }

    function userLogOut(){

        if(Session::has('userId')){
            
            Session::pull('userId');
            return redirect('login');
        }
    }
}
