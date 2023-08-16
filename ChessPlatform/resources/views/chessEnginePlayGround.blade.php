<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/enginePlayGround.css">

    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/ChessBoardArray/ChessBoardArrayFiller.js"></script>

    <script src = "/js/ChessPiecesMovement/FilterMoves.js"></script>
    <script src = "/js/ChessPiecesMovement/GameStatusChecker.js"></script>
    <script src = "/js/ChessPiecesMovement/PiecesMovementManager.js"></script>
    <script src = "/js/ChessPiecesMovement/UpdatedFenPositionGenerator.js"></script>

    <script src = "/js/playGround.js"></script>
    <script src = "/js/globals.js"></script>
</head>
<body>

    <div class = "main-container">

        <div class = "chat-gameDetail-area">
            <h3>{{$data['gameType']}}</h3>

            <div class = "players-color">
                <div>Player White: {{$data['apiObject']['playerWhiteId']}}</div>
                <div>Player Black: {{$data['apiObject']['playerBlackId']}}</div>
            </div>

            <div class = "chat-area">

                <div class = "chats">
                    <div class = "chat-msg">

                    </div>

                    <div class = "msg-submit">
                        <input type="text">
                        <button>Submit</button>
                    </div>
                </div>

            </div>
        </div>
        <div class = "chessBrd-area"></div>
        <div class = "moveDetail-area">
            <div class = "player1Details">

                <div class = "playerHeading">
                    
                    @if($data['apiObject']['yourColor'] == 'w')
                        {{$data['apiObject']['playerBlackId']}}
                    @endif
                    
                    @if($data['apiObject']['yourColor'] == 'b')
                        {{$data['apiObject']['playerWhiteId']}}
                    @endif
                </div>
                
            </div>
            <div class = "moves-details">
                <div>1. e3 e4</div>
                <div>2. a2 a4</div>
            </div>
            <div class = "player2Details">

                <div class = "playerHeading">
                    @if($data['apiObject']['yourColor'] == 'w')
                        {{$data['apiObject']['playerWhiteId']}}
                    @endif
                    
                    @if($data['apiObject']['yourColor'] == 'b')
                        {{$data['apiObject']['playerBlackId']}}
                    @endif
                </div>

            </div>
            <div class = "gameControllers">
                <button class = "btn-leave">Exit</button>
                <button class = "btn-newGame">New Game</button>
            </div>
        </div>

    </div>

    <div class = "randomTest">

    </div>

    <script>

        //Game Starts By receiving this Api and distributing them and calling main of playGround
        function mainEventLoader(apiInformation){

            apiInfos = apiInformation;

            playerId = apiInfos.yourId;
            computerId = apiInfos.computerId;

            fenPosition = apiInfos.fenPosition;
            playerColor = apiInfos.yourColor;
            castelDetails = apiInfos.castelDetails;
            

            document.addEventListener('DOMContentLoaded', main);
        }

        //Send API Information to function
        const api = @json($data['apiObject']);
        mainEventLoader(api);
    </script>
    
</body>
</html>