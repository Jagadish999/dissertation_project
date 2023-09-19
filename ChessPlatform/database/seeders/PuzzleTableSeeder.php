<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Puzzle;

class PuzzleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Puzzle::create([
            'fenPosition' => '7k/5ppp/8/8/8/8/8/K1R5 w - - 3 4',
            'category' => 'checkmate',
            'numberOfMoves' => 1,
        ]);
    }
}
