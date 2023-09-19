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

    //Test cases for redirecting to dashboard view
    public function testDashboardRedirection()
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


    //Test cases for redirecting to play view
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

        $response->assertStatus(200);
        $response->assertViewIs('responsive.play');
    }

    public function testAnalysisView(){
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

        $response = $this->get('/analysis');
        $response->assertStatus(200);
        $response->assertViewIs('responsive.analysis');
    }

    public function testLeaderboardView(){
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

        $response = $this->get('/leaderboard');
        $response->assertStatus(200);
        $response->assertViewIs('responsive.leaderboard');
    }

    public function testPuzzledView(){
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

        $response = $this->get('/puzzle');
        $response->assertStatus(200);
        $response->assertViewIs('responsive.puzzle');
    }

    public function testEditView(){
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

        $response = $this->get('/editprofile');
        $response->assertStatus(200);
        $response->assertViewIs('responsive.editprofile');
    }
}