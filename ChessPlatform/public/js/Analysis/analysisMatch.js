const initialFenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
const initialMove = null;

const nodeServerUrl = 'http://localhost:3000';

function analysisMain(apiData, playerColor){

    startGameAnalysis(apiData, playerColor);
}

function startGameAnalysis(apiData, playerColor){

    //set initial Pos
    boardSetup(initialFenPos, playerColor, initialMove);
    setCounterForMoves(apiData, playerColor);
}

function setCounterForMoves(apiData, playerColor) {
    let counter = -1;

    const msgArea = document.getElementsByClassName('chat-area')[0];

    const previous = document.getElementsByClassName('previous')[0];
    const next = document.getElementsByClassName('next')[0];

    const bestMoveBtn = document.getElementsByClassName('best-move')[0];

    previous.addEventListener('click', () => {

        if(counter == -1){
            boardSetup(initialFenPos, playerColor, initialMove);
            changeTextInHtml(msgArea, "");
        }
        else{

            counter--;

            if(counter >= 0){
                boardSetup(apiData[counter].finalfenPosition, playerColor, apiData[counter].move);
                changeTextInHtml(msgArea, apiData[counter].move);
            }
            else{
                //counter == 0
                boardSetup(initialFenPos, playerColor, initialMove);
                changeTextInHtml(msgArea, "");
            }
        }

    });

    next.addEventListener('click', () => {
        
        if(counter != apiData.length - 1){
            counter++;
        }

        if (counter > -1 && counter < apiData.length) {
            boardSetup(apiData[counter].finalfenPosition, playerColor, apiData[counter].move);
            changeTextInHtml(msgArea, apiData[counter].move);
        }
    });

        // Add a click event listener to the button
    bestMoveBtn.addEventListener('click', async () => {
        let fenPosition;
        let depthValue = 10; // Add a variable for depth

        if (counter === -1) {
            fenPosition = initialFenPos;
        } else {
            fenPosition = apiData[counter].finalfenPosition;
        }

        console.log("Current Fen Pos: " + fenPosition);

        try {
            // Make a POST request to the Node.js route
            const response = await fetch(`${nodeServerUrl}/stockfish-api/get-best-move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ fen: fenPosition, depth: depthValue }), // Include depth in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to fetch best move');
            }

            const data = await response.json();
            console.log('The best move is:', data.best_move);
        } catch (error) {
            console.error('Error:', error);
        }
    });
}


function boardSetup(fenPos, playerColor, currentMove){

    const chessBoardHolder = document.getElementsByClassName('board-fen-pos')[0];
    const board = currentBoardPosition(fenPos, playerColor);

    while(chessBoardHolder.firstChild){
        chessBoardHolder.removeChild(chessBoardHolder.firstChild);
    }

    //If previous move exist make it visible in chess board
    if(currentMove != null){
        //making array of current move and high lighting its square
        const move = currentMove.split(" ");

        const sq1 = board.getElementsByClassName(move[1])[0];
        const sq2 = board.getElementsByClassName(move[2])[0];


        sq1.style.backgroundColor = "grey";
        sq1.style.border = "2px solid black";

        sq2.style.backgroundColor = "grey";
        sq2.style.border = "2px solid black";

    }

    chessBoardHolder.appendChild(board);
}

//Pass the fen Position and player color and get chess board with current fen position
function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#b48766';
    const brdSecondColor = '#edd9b6';
    const brdheight = 500;
    const brdWidth = 500;

    //Object of ChessBoard for empty chess board
    const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setPieces();

    return brdWithPieces;
}

function changeTextInHtml(element, text){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
    element.textContent = text;
}

// Define the getBestMoveFromStockfish function
async function getBestMoveFromStockfish(fenPosition, depthValue) {
    try {
        const response = await fetch('/stockfish/get-best-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ fen: fenPosition, depth: depthValue }), // Include depth in the request body
        });

        if (!response.ok) {
            throw new Error('Failed to fetch best move');
        }

        const data = await response.json();
        return data.best_move;

    } catch (error) {
        throw error;
    }
}