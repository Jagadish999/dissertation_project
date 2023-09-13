<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <link rel="stylesheet" href="/css/dashboard/style.css">
    <link rel="stylesheet" href="/css/analysis/analysis.css">

    <script src = "/js/chess/ChessUIHandler/ChessElementHandler.js"></script>
    <script src = "/js/chess/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/chess/BoardSetup/ChessPieceSetter.js"></script>
    
    <title>Analysis</title> 
</head>
<body>

    @include('partials.navigation')
    @include('partials.analysiscontain')


    <script src = "/js/dashboard/script.js"></script>

    <script>
        const serverDataOnlineMatch = @json($allOnlineMatchdata);
        const serverDataEngineMatch = @json($allEngineMatches);
        // const serverData1 = @json($allOnlineMatchdata);

        console.log(serverDataOnlineMatch);
        console.log(serverDataEngineMatch);


        function finalPositionLoader(){
            
            const finalPositionHolder = document.getElementsByClassName('fenPos');
            const finalPositionEngine = document.getElementsByClassName('fenPosEngine');

            for(let i = 0; i < serverDataOnlineMatch.length; i++){

                const fenPos = serverDataOnlineMatch[i].endingFenPosition;
                const uIHandler = new ChessElementHandler(fenPos, serverDataOnlineMatch.yourColor);
                const board = uIHandler.getBoardWithRequiredSize(250, fenPos, serverDataOnlineMatch.yourColor);

                uIHandler.placeChildElementInParentElement(board, finalPositionHolder[i])
            }

            for(let i = 0; i < serverDataEngineMatch.length; i++){

                const fenPos = serverDataEngineMatch[i].endingFenPosition;
                const uIHandler = new ChessElementHandler(fenPos, serverDataEngineMatch.yourColor);
                const board = uIHandler.getBoardWithRequiredSize(250, fenPos, serverDataEngineMatch.yourColor);

                uIHandler.placeChildElementInParentElement(board, finalPositionEngine[i]);
            }

        }

        document.addEventListener('DOMContentLoaded', finalPositionLoader);
    </script>

</body>
</html>