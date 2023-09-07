
function boardSetup(fenPos, playerColor, currentMove){

    const chessBoardHolder = document.getElementsByClassName('board')[0];
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

function main(){
    const initialFenPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
    boardSetup(initialFenPos, 'w', null);

    puzzleSubmitted();
}

function puzzleSubmitted(){
    
}

document.addEventListener('DOMContentLoaded', main);