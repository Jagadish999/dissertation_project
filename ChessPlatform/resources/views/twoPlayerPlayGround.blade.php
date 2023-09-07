<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Document</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/enginePlayGround.css">

    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/ChessBoardArray/ChessBoardArrayFiller.js"></script>

    <script src = "/js/ChessPiecesMovement/FilterMoves.js"></script>
    <script src = "/js/ChessPiecesMovement/GameStatusChecker.js"></script>
    <script src = "/js/ChessPiecesMovement/PiecesMovementManager.js"></script>
    <script src = "/js/ChessPiecesMovement/UpdatedFenPositionGenerator.js"></script>

    <script src = "/js/Multiplayer/playGround.js"></script>
    <script src = "/js/Multiplayer/globals.js"></script>
</head>
<body>

    <div class = "main-container">

        <div class = "chat-gameDetail-area">
            <h3>{{$data['gameType']}}</h3>

            <div class = "players-color">
                <div>Player White: {{$data['apiObject']['playerWhiteName']}} [{{$data['playerWhiteRating']}}]</div>
                <div>Player Black: {{$data['apiObject']['playerBlackName']}} [{{$data['playerBlackRating']}}]</div>
            </div>

            <div class = "chat-area">

                <div class = "chats">
                    <div class = "chat-msg">

                    </div>
                    @if($data['apiObject']['playerBlackId'] == $data['apiObject']['yourId'] || $data['apiObject']['playerWhiteId'] == $data['apiObject']['yourId'])
                        <div class = "msg-submit">
                            <input type="text" class = "input-msg-field">
                            <button class = "btn-submit-msg">Submit</button>
                        </div>
                    @endif

                </div>

            </div>
        </div>
        <div class = "chessBrd-area"></div>
        <div class = "moveDetail-area">
            <div class = "player1Details">

                <div class = "playerHeading">

                    @if($data['apiObject']['playerBlackId'] == $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerWhiteName']}} 
                        <span class = "time-details-white">

                        </span>
                    @endif
                    
                    @if($data['apiObject']['playerWhiteId'] == $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerBlackName']}}
                        <span class = "time-details-black">

                        </span>
                    @endif

                    @if($data['apiObject']['playerWhiteId'] != $data['apiObject']['yourId'] && $data['apiObject']['playerBlackId'] != $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerBlackName']}}
                        <span class = "time-details-black">

                        </span>
                    @endif



                </div>
                
            </div>
            <div class = "moves-details">

            </div>
            <div class = "player2Details">

                <div class = "playerHeading">

                    @if($data['apiObject']['playerBlackId'] == $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerBlackName']}}
                        <span class = "time-details-black">

                        </span>
                    @endif
                    
                    @if($data['apiObject']['playerWhiteId'] == $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerWhiteName']}}
                        <span class = "time-details-white">

                        </span>
                    @endif

                    @if($data['apiObject']['playerWhiteId'] != $data['apiObject']['yourId'] && $data['apiObject']['playerBlackId'] != $data['apiObject']['yourId'])
                        {{$data['apiObject']['playerWhiteName']}}
                        <span class = "time-details-white">

                        </span>
                    @endif

                </div>

            </div>
            <div class = "gameControllers">
            <button class = "btn-leave"><a href="/play">Exit</a></button>

            </div>
        </div>

    </div>

    <div class = "match-over-message">


        <div class = "final-rating">
            
        </div>

        <button class = "btn-leave"><a href="/play">OK</a></button>

    </div>

    <script src = "{{asset('build/assets/app-4212186a.js')}}"></script>
    
    <script>
        const api = @json($data);


        Echo.join('MessageSent').listen('PlayerMessage', (event) => {

            const msgArea = document.getElementsByClassName('chat-msg')[0];
            const msgDiv = document.createElement('div');

            msgDiv.textContent = event.playerName + ": " + event.playerMessage;

            msgArea.appendChild(msgDiv);


        });

        console.log(@json($data));
        multiplayerEventLoader(api);

        Echo.join('MoveDetaction')

        .listen('PlayerMadeMove', (event) => {

            console.log("From channel")
            console.log(event.apiData);

            //Update move in moves showing section
            const moveDetailsArea = document.getElementsByClassName('moves-details')[0];
            const divForMove = document.createElement('div');

            const textNode = document.createTextNode(event.apiData.apiObject.currentMove);
            divForMove.appendChild(textNode);
            moveDetailsArea.appendChild(divForMove);
            
            multiplayerEventLoader(event.apiData);
            main();
        });

        function multiplayerEventLoader(apiInformation){

            console.log("From main")

            mainApiInfo = apiInformation;
            apiInfos = mainApiInfo.apiObject;

            fenPosition = apiInfos.finalFenPosition;
            castelDetails = apiInfos.castelDetails;

            whiteRemainingTime = apiInformation.whiteRemainingTime;
            blackRemainingTime = apiInformation.blackRemainingTime;

            document.addEventListener('DOMContentLoaded', main);
        }

        //Send API Information to function

        yourId = api.apiObject.yourId;
        yourName = api.apiObject.yourName;

        playerColor = 'w';

        if(yourId == api.apiObject.playerBlackId){
            playerColor = 'b';
        }
        else if(yourId == api.apiObject.playerWhiteId){
            playerColor = 'w';
        }

        const msgSubmitBtn = document.getElementsByClassName('btn-submit-msg')[0];
        const msgInputArea = document.getElementsByClassName('input-msg-field')[0];
        
        msgSubmitBtn.addEventListener('click', () => {
            if(msgInputArea.value.length > 0){
                //call a post method by providing data

                const data = {
                    "name" : yourName,
                    "msg" : msgInputArea.value,
                    "channelNumber" : mainApiInfo.channelNumber
                }

                msgInputArea.value = "";

                broadCastAndRecordMove(data, "/playerMessaged", "POST")
            }
        });


    </script>
    
</body>
</html>