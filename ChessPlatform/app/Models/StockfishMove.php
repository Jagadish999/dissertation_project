<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockfishMove extends Model
{
    use HasFactory;

    protected $table = 'stockfish_moves';

    public $timestamps = false;

    protected $fillable = [
        'matchNumber',
        'startingFenPosition',
        'finalFenPosition',
        'move',
        // Add any other fields you need to fillable
    ];
}
