<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $channelNumber;
    public $playerId;
    public $playerMessage;

    /**
     * Create a new event instance.
     */
    public function __construct($channelNumber, $playerId, $playerMessage)
    {
        $this->channelNumber = $channelNumber;
        $this->playerId = $playerId;
        $this->playerMessage = $playerMessage;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PresenceChannel('MessageSent');
    }
}
