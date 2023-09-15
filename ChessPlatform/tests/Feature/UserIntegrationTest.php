<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class UserIntegrationTest extends TestCase
{

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    // public function test_password_can_be_updated(): void 
    // {
    //     // Create a user for testing
    //     $user = User::create([
    //         'name' => 'test name',
    //         'email' => 'test@example.com',
    //         'password' => 'password',
    //         'image' => 'dummy.jpg',
    //     ]);

    //     // Acting as the authenticated user
    //     $this->actingAs($user);

    //     $csrfToken = csrf_token();
    
    //     $response = $this
    //         ->from('/profile')
    //         ->withSession(['_token' => $csrfToken])
    //         ->put('/password', [
    //             '_token' => $csrfToken,
    //             'current_password' => 'password',
    //             'password' => 'new-password',
    //             'password_confirmation' => 'new-password',
    //         ]);

    //     // Assertions
    //     $response->assertSessionHasNoErrors();
    //     $response->assertRedirect(route('editprofile'));

    //     // Check if the password has been updated in the database
    //     $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    // }
}
