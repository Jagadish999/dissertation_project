<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('onlineUsers', function ($user) {
    return $user;
});

Broadcast::channel('PlayerMatchedSuccessfully', function ($user) {
    return $user;
});

Broadcast::channel('MoveDetaction', function ($user) {
    return $user;
});

Broadcast::channel('MessageSent', function ($user) {
    return $user;
});
