<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/enginePlayGround.css">

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
                    
                    Player Heading 1
                </div>
                
            </div>
            <div class = "moves-details">
                <div>1. e3 e4</div>
                <div>2. a2 a4</div>
            </div>
            <div class = "player2Details">

                <div class = "playerHeading">
                    Player Heading 2
                </div>

            </div>
            <div class = "gameControllers">
            <button class = "btn-leave"><a href="/play">Exit</a></button>

            </div>
        </div>

    </div>

    <div class = "randomTest">

    </div>

    <script>

        //Send API Information to function
        const api = @json($data['apiObject']);

    </script>
    
</body>
</html>