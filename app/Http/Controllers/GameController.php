<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Game;

class GameController extends Controller
{
    public function import () {
        $games = Game::all();
        return response()->json($games);
    }

        public function post () {
        $games = new Game([]);
        
        // return response()->json($games);
    }

}
