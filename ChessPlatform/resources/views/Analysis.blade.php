<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Play Online</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">

    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

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

            @foreach($data as $eachMatch)

                <div class = "match-details">

                    <button id = "{{ $eachMatch['matchId'] }}">Analysis</button>

                    <h1>White Player: {{ $eachMatch['whitePlayerName'] }}</h1>
                    <h1>Black Player: {{ $eachMatch['blackPlayerName'] }}</h1>

                    <div class = "fenPos">

                    </div>
                    
                    <p>Number of Moves: {{ $eachMatch['totalNumberOfMoves'] }}</p>

                </div>

                <br> <br> <br>
                    
                    

            @endforeach

        </div>

    </div>

    <script>

        const allApiInfos = @json($data);
        console.log(allApiInfos);

        function showFinalFenPosition(api){

            const allFenPosHolder = document.getElementsByClassName('fenPos');

            for(let i = 0; i < api.length; i++){

                boardSetup(allFenPosHolder[i], api[i].endingFenPosition, api[i].yourColor);
            }
        }

        function boardSetup(boardHolder, fenPos, playerColor){

            const board = currentBoardPosition(fenPos, playerColor);

            while(boardHolder.firstChild){
                boardHolder.removeChild(boardHolder.firstChild);
            }

            boardHolder.appendChild(board);
        }

        function currentBoardPosition(fenPos, color){

            const brdFirstColor = '#b48766';
            const brdSecondColor = '#edd9b6';
            const brdheight = 200;
            const brdWidth = 200;

            //Object of ChessBoard for empty chess board
            const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
            const emptyBoard = boardObj.createBoard();

            //board appended to empty chess board
            const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
            let brdWithPieces = brdWithPiecesObj.setPieces();

            return brdWithPieces;
        }

        function analysisOfMatch(){
            const analysisBtn = document.getElementsByTagName('button');

            for(let i = 0; i < analysisBtn.length; i++){
                analysisBtn[i].addEventListener('click', () => {
                    window.location.href = '/analysisMatch/' + analysisBtn[i].id;
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            showFinalFenPosition(allApiInfos);
            analysisOfMatch();
        });

    </script>


</body>
</html>