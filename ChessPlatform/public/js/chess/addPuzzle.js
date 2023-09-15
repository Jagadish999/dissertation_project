function addPuzzleMainLoader(){

    setInitialPuzzleBoardSetup("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    fenPositionReceiver();

    const exitBtn = document.getElementsByClassName('exit-button')[0];
    exitBtn.addEventListener('click', () => {
        window.location.href = '/puzzle';
    });
}

let globalMovesReceiver;
let globalMoveCounters = 0;

function showAllPosibleMoves(allPossibleMovesAndPositions){

    globalMovesReceiver = allPossibleMovesAndPositions;

    const initialBtns = document.getElementsByClassName('before-verification')[0];
    const afterBtns = document.getElementsByClassName('after-verfication')[0];

    initialBtns.style.display = 'none';
    afterBtns.style.display = 'flex';

    const nextBtn = document.getElementsByClassName('next')[0];
    const previousBtn = document.getElementsByClassName('previous')[0];
    const exitBtn = document.getElementsByClassName('exit-game')[0];

    exitBtn.addEventListener('click', () => {
        window.location.href = '/addpuzzle';
    });

    nextBtn.addEventListener('click', () => {
        if(globalMoveCounters < globalMovesReceiver.length){
            globalMoveCounters++;
            showAllBestMovesPossible(globalMoveCounters);
        }
    });

    previousBtn.addEventListener('click', () => {
        if(globalMoveCounters > 1){
            globalMoveCounters--;
            showAllBestMovesPossible(globalMoveCounters);
        }
    });
}
function showAllBestMovesPossible(moveCount){

    const currentFenPosition = globalMovesReceiver[moveCount - 1].finalFenPosition;
    const currentMove = globalMovesReceiver[moveCount - 1].currentMove;

    console.log("Global Counter: " + globalMoveCounters);
    const playerColor = 'w';
    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);
    chessElementHandlerObj.setBoardWithMove(currentMove);

    if(globalMoveCounters > 0){
        const moveAudio = new Audio('/Sounds/move.mp3');
        const captureAudio = new Audio('/Sounds/Capture.mp3');
        const castlingAudio = new Audio('/Sounds/Castling.mp3');
        const checkmateAudio = new Audio('/Sounds/Checkmate.mp3');
        const drawAudio = new Audio('/Sounds/Draw.mp3');


        if(currentMove.split(" ").length == 4){
            drawAudio.play();
        }
        else if(currentMove.split(" ").length == 5){
            checkmateAudio.play();
        }
        else if(currentMove.split(" ")[0].length > 1){
            //Either castel or capture
            if(currentMove.split(" ")[0][1] == 'x'){
                captureAudio.play();
            }
            else if(currentMove.split(" ")[0][1] == 'c'){
                castlingAudio.play();
            }
        }
        else if(currentMove.split(" ").length == 3){
            moveAudio.play();
        }

    }

    let allMoveAndFen = globalMovesReceiver.slice(0, moveCount);
    const moveLists = allMoveAndFen.map(obj => obj.currentMove);

    //Hide message to player
    const messageShow = document.getElementsByClassName('headMsg')[0];
    messageShow.style.display = 'none';

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const movesHolder = document.getElementsByClassName('moves-details-wrapper')[0];

    chessElementHandlerObj.getBoardWithPieces();

    let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();
    let movesInDivs = chessElementHandlerObj.createMoveElements(moveLists);

    chessElementHandlerObj.clearParentElement(boardContainer);
    chessElementHandlerObj.clearParentElement(movesHolder);

    chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);
    chessElementHandlerObj. placeChildElementInParentElement(movesInDivs, movesHolder);


}

async function callPostMethod(requiredData, redirectURL, method){

    try {
    const response = await fetch(redirectURL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(requiredData)
    });

    } 
    catch (error) {
        console.error('Error:', error);
    }
}

async function fenPositionValidator(fenPosition, numberOfMoves){

    const chessElementHandlerObj = new ChessElementHandler("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 'w');
    const messageHolder = document.getElementsByClassName('message-to-user')[0]; 

    const puzzleCheckerObj = new PuzzleChecker(fenPosition);
    const validFenPos = puzzleCheckerObj.checkFenPositionValidation();

    if(!validFenPos){
        chessElementHandlerObj.clearParentElement(messageHolder);
        chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("!!! Invalid FEN Position !!!", "danger-message"), messageHolder);
    }
    else{
        chessElementHandlerObj.clearParentElement(messageHolder);
        chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("Valid FEN Position", "safe-message"), messageHolder);

        //Set the board
        setInitialPuzzleBoardSetup(fenPosition);

        //Start calculating
        try{
            const allPossibleMovesAndPositions = await checkmateChecker(fenPosition, numberOfMoves, puzzleCheckerObj.returnCastelDetails());

            // console.log(allPossibleMovesAndPositions);

            if(allPossibleMovesAndPositions.length == 0){
                chessElementHandlerObj.clearParentElement(messageHolder);
                chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("Position Already checkmated", "danger-message"), messageHolder);
            }
            else if(allPossibleMovesAndPositions.length == numberOfMoves * 2 -1){
                chessElementHandlerObj.clearParentElement(messageHolder);
                chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("Valid Checkmate Position. Look all the best moves", "safe-message"), messageHolder);

                showAllPosibleMoves(allPossibleMovesAndPositions);
                const data = {
                    fenPos : fenPosition,
                    numberOfMoves : numberOfMoves
                };

                callPostMethod(data, "/insertPuzzle", "POST");
                //_________________Insert in DB_____________________________________________________
            }
            else if(allPossibleMovesAndPositions.length == numberOfMoves * 2){
                chessElementHandlerObj.clearParentElement(messageHolder);
                chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("Checkmate not possible in "+numberOfMoves+" number of moves", "danger-message"), messageHolder);

                showAllPosibleMoves(allPossibleMovesAndPositions);
            }
            else{
                chessElementHandlerObj.clearParentElement(messageHolder);
                chessElementHandlerObj. placeChildElementInParentElement(createMessageH2("Position Checkmated before given number of moves", "danger-message"), messageHolder);

                showAllPosibleMoves(allPossibleMovesAndPositions)
            }
        }
        catch(error){
            console.error("An error occurred:", error);
        }
    }
}

async function checkmateChecker(fenPosition, numberOfMoves, castelDetails){

    const depth = 30;
    const nodeServerUrl = 'http://localhost:3000';

    let currentFenPosition = fenPosition;
    let currentCastelDetails = castelDetails;

    let allGameDetails = [];

    for(let i = 0; i < numberOfMoves * 2; i++){

        const getOrPostRequestObj = new GetOrPostRequest(); 

        try{
            const bestMove = await getOrPostRequestObj.getBestMove(currentFenPosition, depth, nodeServerUrl);
            
            //If position is checkmated break loop
            if(bestMove.trim() == "(none)"){

                break;
            }
            else{
                const mainEventHandlerObj = new MainChessController(currentFenPosition, currentCastelDetails);

                //The Position is receiving best move
                const currentSquareOfPiece = mainEventHandlerObj.findPieceCurrnetSquare(bestMove);
                const movedSquareOfPiece = mainEventHandlerObj.findPieceMovedSquare(bestMove);
                const pieceDetails = mainEventHandlerObj.findSelectedPieceDetails(currentSquareOfPiece);
                const promotionStatus = mainEventHandlerObj.findPawnPromotionIfExist(bestMove);

                mainEventHandlerObj.setUpdatedFenPositionAndCastelPerms([pieceDetails, movedSquareOfPiece, promotionStatus]);
                mainEventHandlerObj.setUpdatedFenPositionStatus();
                mainEventHandlerObj.setCurrentMove([pieceDetails, movedSquareOfPiece, promotionStatus]);

                const newFenPosition = mainEventHandlerObj.getUpdatedFenPosition();
                const newCastelDetails = mainEventHandlerObj.getUpdatedCastelPerms();
                const currentMove = mainEventHandlerObj.getCurrentMove();
                
                const tempObj = {
                    startingFenPosition : currentFenPosition,
                    finalFenPosition : newFenPosition,
                    currentMove : currentMove
                }
                allGameDetails[i] = tempObj

                currentCastelDetails = newCastelDetails;
                currentFenPosition = newFenPosition;
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }

    return allGameDetails;
}


function fenPositionReceiver(){

    const fenInput = document.getElementById('fenInput');
    const validateBtn = document.getElementById('validateButton');
    const numberOfMoves = document.getElementById('numberOfMoves');

    const messageHolder = document.getElementsByClassName('message-to-user')[0];

    fenInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            if(fenInput.value != ""){
                fenPositionValidator(fenInput.value, numberOfMoves.value);
            }
            else{
                while(messageHolder.firstChild){
                    messageHolder.removeChild(messageHolder.firstChild);
                }
                messageHolder.appendChild(createMessageH2("!!You Entered Empty Position!!!", "danger-message"));
            }

            fenInput.value = "";
        }
    });

    // Event listener for clicking the "Validate" button
    validateBtn.addEventListener('click', () => {
        if(fenInput.value != ""){
            fenPositionValidator(fenInput.value, numberOfMoves.value);
        }
        else{
            while(messageHolder.firstChild){
                messageHolder.removeChild(messageHolder.firstChild);
            }
            messageHolder.appendChild(createMessageH2("!!You Entered Empty Position!!!", "danger-message"));
        }
        fenInput.value = "";
    });
}

function setInitialPuzzleBoardSetup(fenPos){

    const initialFenPosition = fenPos;
    const chessElementHandlerObj = new ChessElementHandler(initialFenPosition, 'w');
    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();

    chessElementHandlerObj.clearParentElement(boardContainer);
    chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);
}

function createMessageH2(text, className) {
    const h2Element = document.createElement('h2');
    h2Element.textContent = text;
    h2Element.className = className + " headMsg";
    return h2Element;
}

document.addEventListener('DOMContentLoaded', addPuzzleMainLoader);