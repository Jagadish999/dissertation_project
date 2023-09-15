<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompletedPuzzle extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = 'completed_puzzles';

    protected $fillable = ['playerId', 'puzzleId', 'status'];
}
