<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <link rel="stylesheet" href="/css/dashboard/style.css">
    <link rel="stylesheet" href="/css/puzzle/showpuzzle.css"> 

    <script src = "/js/chess/ChessUIHandler/ChessElementHandler.js"></script>
    <script src = "/js/chess/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/chess/BoardSetup/ChessPieceSetter.js"></script>
    
    <title>Puzzle</title> 
</head>
<body>

    @include('partials.navigation')
    @include('partials.puzzlecontain')


    <script src = "/js/dashboard/script.js"></script>

    <script>
        const puzzleData = @json($allPuzzlePositions);
        console.log(puzzleData);

        function initialFenPosShower(){
            
            const finalPositionHolder = document.getElementsByClassName('fenPos');

            for(let i = 0; i < puzzleData.length; i++){

                const fenPos = puzzleData[i].fenPosition;
                const uIHandler = new ChessElementHandler(fenPos, fenPos.split(" ")[1]);
                const board = uIHandler.getBoardWithRequiredSize(250, fenPos, fenPos.split(" ")[1]);

                uIHandler.placeChildElementInParentElement(board, finalPositionHolder[i])
            }

        }

        document.addEventListener('DOMContentLoaded', initialFenPosShower);
        
    </script>

</body>
</html>