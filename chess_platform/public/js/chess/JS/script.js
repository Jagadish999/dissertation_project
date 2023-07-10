function mainEventLoader(){

    //Initial board setup
    initialBoardSetup();

    //Fill orgChessBrd and moveChessBrd for move detection
    fillMoveDetectionArrays();

    //Fill oppPiecesDetails and yourPiecesDetails
    fillMoveDetails();

    //Give Hover effect to own pieces if its your turn to make a move
    createHoverEffect();

    //Click tracker in all over the board for movement of piece
    // clickOnBoard();
    extraFunLoader();
}



//Function to show chess board with current fen position
function initialBoardSetup(){

    const mainContainer = document.getElementsByClassName('main-container')[0];
    const currentChessBoard = currentBoardPosition(currentFenPosition, playerColor);

    mainContainer.appendChild(currentChessBoard);
}

//Get chess board with current fen position
function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#B8860B';
    const brdSecondColor = '#8A2BE2';
    const brdheight = 600;
    const brdWidth = 600;

    //Object of ChessBoard for empty chess board
    const boardObj = new EmptyBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new BoardWithPieces(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setAllPieces();

    return brdWithPieces;
}

//Fill helper arrays of movement detection of pieces
function fillMoveDetectionArrays(){

    const visualBrdObj = new BoardVisualization(currentFenPosition);
    visualBrdObj.setOrgChessBrd();

    orgChessBrd = visualBrdObj.setOrgChessBrd();
    moveChessBrd = visualBrdObj.setMoveChessBrd(orgChessBrd);
}

//Fill details of movement of both player
function fillMoveDetails(){

    const pieceDetailsObj = new PieceDetail(orgChessBrd, moveChessBrd, playerColor, currentFenPosition);

    oppPiecesDetails = pieceDetailsObj.opponentPiecesInfo();
    yourPiecesDetails = pieceDetailsObj.yourPiecesInfo();

    displayHelpfulMsg();

    // console.log("Opponent: ");
    // console.log(oppPiecesDetails);
    // console.log("Your piece: ");
    // console.log(yourPiecesDetails);

    console.log(moveChessBrd);
    console.log(yourPiecesDetails);
}

function createHoverEffect(){

    const board = document.getElementsByClassName('chessBoard')[0];

    //create hover effect if its your turn to move
    if(playerColor[0] == currentFenPosition.split(" ")[1]){
        //hover in own pieces and increaes scale of piece
        const hoverEffectObj = new HoverEffect(board, yourPiecesDetails);
        hoverEffectObj.hoverEffectInOwnPieces();
    }
}

function displayHelpfulMsg(){

    let tempChar = "";
    for(let i = 0; i < moveChessBrd.length; i++){
        tempChar += moveChessBrd[i];

        if((i+1) % 10 == 0){
            console.log(tempChar);
            tempChar = "";
        }
    }

    console.log("_________________________");

    tempChar = "";
    for(let i = 0; i < orgChessBrd.length; i++){
        tempChar += orgChessBrd[i];

        if((i+1) % 8 == 0){
            console.log(tempChar);
            tempChar = "";
        }
    }
    console.log("___________________________________");
}

document.addEventListener('DOMContentLoaded', mainEventLoader);