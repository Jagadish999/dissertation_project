function mainEventLoader(){

    const initialBrdPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const tempPlayer = "w";

    setup(initialBrdPos, tempPlayer);
}

function playerSearched(){

    const msgDiv = document.getElementsByClassName('findingPlayer')[0];
    msgDiv.style.display = "block";

    document.getElementsByClassName('gamemodesPart1')[0].style.display = 'none';
}

function setup(f, c){

    const chessBoardHolder = document.getElementsByClassName('chessboard')[0];
    const chessBoard = currentBoardPosition(f, c);

    while(chessBoardHolder.firstChild){
        chessBoardHolder.removeChild(chessBoardHolder.firstChild);
    }

    chessBoardHolder.appendChild(chessBoard);
}

function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#b48766';
    const brdSecondColor = '#edd9b6';
    const brdheight = 550;
    const brdWidth = 550;

    //Object of ChessBoard for empty chess board
    const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setPieces();

    return brdWithPieces;
}

document.addEventListener('DOMContentLoaded', mainEventLoader);