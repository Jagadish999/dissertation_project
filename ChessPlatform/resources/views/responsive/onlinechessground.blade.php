<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Online Multiplayer</title>
    
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <link rel="stylesheet" href="/css/dashboard/style.css">
    <link rel="stylesheet" href="/css/play/engine.css">

    <link rel="stylesheet" href="/css/play/online.css">
    
    <script src = "/js/chess/chess.js"></script>
    
    <script src = "/js/chess/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/chess/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/chess/ChessBoardArray/ChessBoardArrayFiller.js"></script>

    <script src = "/js/chess/ChessPiecesMovement/FilterMoves.js"></script>
    <script src = "/js/chess/ChessPiecesMovement/GameStatusChecker.js"></script>
    <script src = "/js/chess/ChessPiecesMovement/PiecesMovementManager.js"></script>
    <script src = "/js/chess/ChessPiecesMovement/UpdatedFenPositionGenerator.js"></script>

    <script src = "/js/chess/GameController/MainChessController.js"></script>
    <script src = "/js/chess/ChessUIHandler/ChessElementHandler.js"></script>

    <script src = "/js/PostRequest/GetOrPostRequest.js"></script>


</head>
<body>
    @csrf
    @include('partials.onlinechessgroundcontain');

    <script src = "{{asset('build/assets/app-4212186a.js')}}"></script>
    <script>
        let serverData = @json($data);
        console.log(serverData);

        const yourId = serverData.playerInfomation.yourId;
        const blackId = serverData.playerInfomation.playerBlackId;
        const whiteId = serverData.playerInfomation.playerWhiteId;

        Echo.join('MoveDetaction')
        .listen('PlayerMadeMove', (event) => {

            if(yourId == blackId || yourId == whiteId){
                serverData.boardDetails = event.apiData.boardDetails;
                main();
            }
        });

        Echo.join('MessageSent').listen('PlayerMessage', (event) => {

            if(event.playerId == whiteId || event.playerId == blackId){

                const msgArea = document.getElementsByClassName('all-chats')[0];

                const msgClass = event.playerId == yourId ? "chat-self" : "chat-opponent";

                msgArea.appendChild(createChatSelfElement(event.playerMessage, msgClass));

                document.getElementsByClassName('chat-details')[0].style.display = 'block';
                document.getElementsByClassName('moves-details')[0].style.display = 'none';
            }
        });

        function createChatSelfElement(message, className) {

            const chatElement = document.createElement("div");

            chatElement.classList.add(className);
            chatElement.textContent = message;

            return chatElement;
        }

    </script>
    
</body>
</html>