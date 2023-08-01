<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multiplayer</title>
    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/multiplayer.css">

    <script src = "js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "js/multiplayer.js"></script>

</head>
<body>

    <div class = "main-container">

        <div class = "side-nav">
            <nav>
                <li><a href="dashboard">dashboard</a></li>
                <li><a href="multiplayer">Multiplayer</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">
            <div class = "chessboard">

            </div>

            <div class = "gamemodes">
                <div class = "gamemodesPart1">
                    <h2>Choose Game Mode</h2>
                    <div class = "modeList">
                        <a href="/bullet" class = "bullet btn">Bullet: 1 Min</a>
                        <a href="/blitz" class = "blitz btn">Blitz: 3 Min</a>
                        <a href="/classic" class = "classic btn">Classic: 10 Min</a>

                    </div>
                </div>
            </div>
        </div>

    </div>

</body>
</html>