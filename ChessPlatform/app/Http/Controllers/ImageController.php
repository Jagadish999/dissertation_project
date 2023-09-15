<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);
    
        // Get the uploaded file
        $image = $request->file('image');
    
        // Generate a unique name for the image
        $imageName = time().'.'.$image->extension();
    
        // Specify the directory where you want to store the image
        $image->move(public_path('/Images/Profile/'), $imageName);
    
        // Get the authenticated user
        $user = auth()->user();
    
        // Update the user's image column with the image name
        $user->update(['image' => $imageName]);
    
        return redirect()->back()->with('success', 'Image uploaded successfully');
    }
}
