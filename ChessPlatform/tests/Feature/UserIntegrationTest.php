<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Rating;

class UserIntegrationTest extends TestCase
{

    public function testNewUserRegister(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    public function testUserLogin(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function testUserLoginAuthen(): void
    {
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
    
        $response = $this->get('/dashboard');
        $response->assertStatus(status:200);
    }

    public function testUserRegistration(): void
    {
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'image' => 'dummy.jpg',
        ];
    
        $response = $this->get('/register');
        $response->assertStatus(200);
    
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
    
        $response = $this->post('/register', $userData);
        
        $response->assertRedirect('/register');
    }
    
}
