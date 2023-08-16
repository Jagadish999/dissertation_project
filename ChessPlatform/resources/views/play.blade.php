<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Play Online</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/play.css">

    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/multiplayer.js"></script>

</head>
<body>

    <div class = "main-container">

        <div class = "side-nav">
            <nav>
                <li><a href="dashboard" class = "dashboard-nav-list">Dashboard</a></li>
                <li><a href="play" class = "play-nav-list">Play</a></li>
                <li><a href="#">Puzzles</a></li>
                <li><a href="#">Leaderboard</a></li>
                <li><a href="#">Tournament</a></li>
                <li><a href="#">Analysis</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">
            <div class = "brdContent">

            </div>

            <div class = "game-modes">
                <div class = "modes-container">
                    <h1>Game Modes</h1>
                    <div class = "mode-category">
                        <div class = "engine">
                            <div class = "engine-heading">Player Vs Computer</div>
                            <ul class = "engine-levels">
                                <li>
                                    <h3>Level 1:</h3>
                                    <a href="/play/engine/level-1-black" class = "black">Black</a>
                                    <a href="/play/engine/level-1-white" class = "white">White</a>
                                </li>
                            </ul>
                        </div>

                        <div class = "online-category">
                            <div class = "online">
                                <div class = "online-heading">Online Match</div>
                                <ul class = "online-modes">
                                    <li><a href="#">Blitz: 30 sec</a></li>
                                    <li><a href="#">Bullet: 3 min</a></li>
                                    <li><a href="#">Classic: 10 min</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</body>
</html>