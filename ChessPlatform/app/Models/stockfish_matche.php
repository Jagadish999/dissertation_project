<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class stockfish_matche extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'playerId',
        'playerColor',
        'stockfishColor',
        'level',
        'gameStatus'
    ];
}
