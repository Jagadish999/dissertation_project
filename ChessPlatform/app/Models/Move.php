<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Move extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'matchNumber',
        'startingFenPosition',
        'finalFenPosition',
        'move',
        'remainingTimeBlack',
        'remainingTimeWhite',
        'recordedTime'
    ];
}
