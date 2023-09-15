let counter = 0;

function analysisMain(){
    analysisInitialSetter();
}

function analysisInitialSetter(){

    const getOrPostRequestObj = new GetOrPostRequest();
    
    analysisUIHandeler(counter, null);

    const nextBtn = document.getElementsByClassName('next')[0];
    const previousBtn = document.getElementsByClassName('previous')[0];
    const hintBtn = document.getElementsByClassName('best-move')[0];
    const exitBtn = document.getElementsByClassName('exit-game')[0];

    nextBtn.addEventListener('click', () => {

        if(counter < allFenPositions.length -1){
            counter++;
            analysisUIHandeler(counter, null);
        }
    });

    previousBtn.addEventListener('click', () => {
        if(counter > 0){
            counter--;
            analysisUIHandeler(counter, null);
        }
    });

    hintBtn.addEventListener('click', async () => {

        const nodeServerUrl = 'http://localhost:3000';
        try {
            let bestMove = await getOrPostRequestObj.getBestMove(allFenPositions[counter], 30, nodeServerUrl);
            bestMove = bestMove.trim();

            if(bestMove != '(none)'){
                analysisUIHandeler(counter, bestMove);
            }
            
        } catch (error) {
            console.error("Error:", error);
        }
    });

    exitBtn.addEventListener('click', () => {
        window.location.href = '/analysis';
    });
    
}

//Views players move in browser
function analysisUIHandeler(counter, hint){

    const currentFenPosition = allFenPositions[counter];

    let currentMove = null;
    let moveLists = null;
    
    const playerColor = 'w';

    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);

    if(allMoves.length > 0 && counter > 0){
        const moveAudio = new Audio('/Sounds/move.mp3');
        const captureAudio = new Audio('/Sounds/Capture.mp3');
        const castlingAudio = new Audio('/Sounds/Castling.mp3');
        const checkmateAudio = new Audio('/Sounds/Checkmate.mp3');
        const drawAudio = new Audio('/Sounds/Draw.mp3');

        currentMove = allMoves[counter - 1];
        moveLists = allMoves.slice(0, counter);

        chessElementHandlerObj.setBoardWithMove(currentMove);

        if(currentMove.split(" ")[0].length > 1 && hint == null){
            //Either castel or capture
            if(currentMove.split(" ")[0][1] == 'x'){
                captureAudio.play();
            }
            else if(currentMove.split(" ")[0][1] == 'c'){
                castlingAudio.play();
            }
        }
        else if(currentMove.split(" ").length == 3 && hint == null){
            moveAudio.play();
        }
        else if(currentMove.split(" ").length == 4 && hint == null){
            drawAudio.play();
        }
        else if(currentMove.split(" ").length == 5 && hint == null){
            checkmateAudio.play();
        }

    }

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const movesHolder = document.getElementsByClassName('moves-details-wrapper')[0];
    
    chessElementHandlerObj.getBoardWithPieces();
    let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();

    chessElementHandlerObj.clearParentElement(boardContainer);
    chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);

    if(hint != null){
        const currentSquareOfPiece = findPieceCurrnetSquare(hint);
        const movedSquareOfPiece = findPieceMovedSquare(hint);

        document.getElementsByClassName(currentSquareOfPiece)[0].style.backgroundColor = '#FFD700';
        document.getElementsByClassName(currentSquareOfPiece)[0].style.border = '2px solid black';

        document.getElementsByClassName(movedSquareOfPiece)[0].style.backgroundColor = '#FFD700';
        document.getElementsByClassName(movedSquareOfPiece)[0].style.border = '2px solid black';
    }

    if(moveLists != null){
        const movesInDivs = chessElementHandlerObj.createMoveElements(moveLists);
        chessElementHandlerObj.clearParentElement(movesHolder);
        chessElementHandlerObj. placeChildElementInParentElement(movesInDivs, movesHolder);
    }
    else{
        chessElementHandlerObj.clearParentElement(movesHolder);
    }
}

function findPieceMovedSquare(bestMove){
    const firstSq = bestMove.split('');
    return this.fileRankToSquare(firstSq[2], firstSq[3]);
}

function findPieceCurrnetSquare(bestMove){

    const firstSq = bestMove.split('');
    return this.fileRankToSquare(firstSq[0], firstSq[1]);
}

function fileRankToSquare(file, rank){

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
    const totalSq = parseInt(rank) * 8;
    const extraSq = 8 - (files.indexOf(file) + 1);
  
    return totalSq - extraSq;
}