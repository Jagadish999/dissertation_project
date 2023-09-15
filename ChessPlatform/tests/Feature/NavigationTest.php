<?php

namespace Tests\Feature;

use Database\Factories\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Rating;

class NavigationTest extends TestCase
{

    use RefreshDatabase;


    public function testDashboardRedirectionAndData()
    {
        // Create a user record for testing
        $user = User::create([
            'name' => 'test name',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'image' => 'dummy.jpg', // Provide a default image filename
        ]);

        $rating = new Rating([
            'blitz' => 400,
            'bullet' => 400,
            'classic' => 400
        ]);
        $rating->userId = $user->id;

        $rating->save();
    
        $this->actingAs($user);
    
        $response = $this->get('/dashboard');
        $response->assertStatus(status:200);
        $response->assertViewIs('responsive.dashboard');
    }

    public function testPlayView()
    {
        // Create a user record for testing
        $user = User::create([
            'name' => 'test name',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'image' => 'dummy.jpg',
        ]);

        $rating = new Rating([
            'blitz' => 400,
            'bullet' => 400,
            'classic' => 400
        ]);
        $rating->userId = $user->id;
        $rating->save();

        $this->actingAs($user);

        $response = $this->get('/play');

        $userDetails = [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "blitz" => $rating->blitz,
            "bullet" => $rating->bullet,
            "classic" => $rating->classic
        ];

        $response->assertStatus(200);
        $response->assertViewIs('responsive.play');
        $response->assertViewHas('userDetails', $userDetails);

        // You can also assert specific data in the view, for example:
        $response->assertViewHas('userDetails', function ($userDetails) use ($user, $rating) {
            return $userDetails['id'] === $user->id &&
                   $userDetails['name'] === $user->name &&
                   $userDetails['email'] === $user->email &&
                   $userDetails['blitz'] === $rating->blitz &&
                   $userDetails['bullet'] === $rating->bullet &&
                   $userDetails['classic'] === $rating->classic;
        });
    }

    
    

}
