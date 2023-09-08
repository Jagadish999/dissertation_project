<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Play Puzzle</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/addpuzzle.css">

    
    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/ChessBoardArray/ChessBoardArrayFiller.js"></script>

    <script src = "/js/ChessPiecesMovement/FilterMoves.js"></script>
    <script src = "/js/ChessPiecesMovement/GameStatusChecker.js"></script>
    <script src = "/js/ChessPiecesMovement/PiecesMovementManager.js"></script>
    <script src = "/js/ChessPiecesMovement/UpdatedFenPositionGenerator.js"></script>

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
                <label for="category">Select the game outcome:</label>
                <select id="category" name="gameOutcome">
                <option value="Checkmate">Checkmate</option>
                <option value="BestMove">Best Move</option>
                </select>


                <label for="fenInput">Enter FEN Position:</label>
                <input class = "fenPosPuzzle" type="text" id="fenInput" name="fenInput" placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR">

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
                <button class = "checkfen" >Check </button>
                <button class = "submit" >Add Puzzle</button>
                <button class = "checkmate" >Verify Checkmate</button>
            </div>

        </div>

    </div>
    
</body>
</html>