<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Play Puzzle</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/addpuzzle.css">

    
    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "js/AddPuzzle/addpuzzle.js"></script>
</head>
<body>

    <div class = "main-container">

    <div class = "side-nav">
            <nav>
                <li><a href="/dashboard" class = "dashboard-nav-list">Dashboard</a></li>
                <li><a href="/play" class = "play-nav-list">Play</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/puzzle">Puzzles</a></li>
                <li><a href="/addpuzzle">Add Puzzles</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
                <li><a href="/analysis">Analysis</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">

            <div class = "puzzle-type-specifier">
                <label for="gameOutcome">Select the game outcome:</label>
                <select id="gameOutcome" name="gameOutcome">
                <option value="checkmate">Checkmate</option>
                <option value="bestMove">Best Move</option>
                </select>


                <label for="fenInput">Enter FEN Position:</label>
                <input type="text" id="fenInput" name="fenInput" placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR">

                <label for="numberOfMoves">Select the number of moves:</label>
                    <select id="numberOfMoves" name="numberOfMoves">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    </select>


            </div>

            <div class = "board">

            </div>

            <div class = "controller">
                <button>Check </button>
                <button>Add </button>
            </div>

        </div>

    </div>
    
</body>
</html>