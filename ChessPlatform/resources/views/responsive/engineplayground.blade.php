<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">


    <title>Chess Engine</title>
    
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <link rel="stylesheet" href="/css/dashboard/style.css">
    <link rel="stylesheet" href="/css/play/engine.css">
    

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

    @include('partials.enginegroundcontain')

    <script>
        const serverData = @json($data);
        console.log(serverData);


        //Place Images Properly
    </script>
    
</body>
</html>