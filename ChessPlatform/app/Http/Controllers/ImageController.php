<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);
    
        $image = $request->file('image');
        $imageName = time() . '_' . Str::random(10) . '.' . $image->extension();
        $image->move(public_path('/Images/Profile/'), $imageName);
        $user = auth()->user();

        if ($user->image !== 'dummy.png') {
            $currentImagePath = public_path('/Images/Profile/') . $user->image;
            if (file_exists($currentImagePath)) {
                unlink($currentImagePath);
            }
        }

        $user->update(['image' => $imageName]);
    
        return redirect()->back()->with('success', 'Image uploaded successfully');
    }
}
