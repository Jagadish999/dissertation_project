<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Rating;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a user
        $user = User::create([
            'name' => 'Jagadish Parajuli',
            'email' => 'parajulijagadish9@gmail.com',
            'password' => Hash::make('123456789'),
            'image' => 'dummy.png',
        ]);

        // Create ratings for the user
        $rating = new Rating([
            'blitz' => 400,
            'bullet' => 400,
            'classic' => 400,
        ]);

        // Associate the rating with the user
        $rating->userId = $user->id;
        $rating->save();
    }
}
