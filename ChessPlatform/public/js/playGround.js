//suppose game starts by receiving API apiObject
function main(){

    //show board in browser
    boardSetup();

    //Find all the legal Moves of both player
    fillAllLeagalMoves();

    //check game status: check, stalemate or checkmate
    currentGameStatusChecker();

    //If current game Status is normal make a move
    if(!checkmate && !stalemate){
        if(fenPosition.split(" ")[1] == playerColor){
            playerMakesMove();
        }
        else{
            setTimeout(computerMakesMove, 1000);
        }
    }
    else{
        console.log("Game Over");
        boardSetup();
    }
}

//Just fill the fenPosition and player color and board is presented
function boardSetup(){

    const chessBoardHolder = document.getElementsByClassName('chessBrd-area')[0];
    const board = currentBoardPosition(fenPosition, playerColor);

    while(chessBoardHolder.firstChild){
        chessBoardHolder.removeChild(chessBoardHolder.firstChild);
    }

    chessBoardHolder.appendChild(board);
}

//Pass the fen Position and player color and get chess board with current fen position
function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#b48766';
    const brdSecondColor = '#edd9b6';
    const brdheight = 650;
    const brdWidth = 650;

    //Object of ChessBoard for empty chess board
    const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setPieces();

    return brdWithPieces;
}

//Finds all the legal moves and fills to yourMoves and opponentMoves in globals with respect to currentPlayerToMove
function fillAllLeagalMoves(){

    const currentPlayerToMove = fenPosition.split(" ")[1];
    const chessBoardArrayFillerObj = new ChessBoardArrayFiller(fenPosition);

    chessBoardArray = chessBoardArrayFillerObj.fillChessBoardArray();
    piecesMoveDetectionArray = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(chessBoardArray);

    const gameStatusCheckerObj = new GameStatusChecker();
    const filterMovesObj = new FilterMoves(gameStatusCheckerObj, currentPlayerToMove, chessBoardArray, piecesMoveDetectionArray, fenPosition, castelDetails);

    const legalMovesCaptures = filterMovesObj.filteredMoves();

    yourMoves = legalMovesCaptures[0];
    opponentMoves = legalMovesCaptures[1];
}

//Finds game status of curret player to make a move
function currentGameStatusChecker(){

    //Find whose turn to move
    const currentPlayerToMove = fenPosition.split(" ")[1];
    const gameStatusCheckerObj = new GameStatusChecker();

    //check if its check, checkmate or stalemate
    check = gameStatusCheckerObj.findCheck(currentPlayerToMove, yourMoves, opponentMoves);
    checkmate = gameStatusCheckerObj.findCheckmate(yourMoves, check);
    stalemate = gameStatusCheckerObj.findStalemate(fenPosition, yourMoves, check, opponentMoves);

    if(checkmate){
        checkmateAudio.play();
    }
    else if(check){
        checkAudio.play();
    }
    else if(stalemate){
        drawAudio.play();
    }
}

//Update board for player making move
function playerMakesMove(){
    
    ownPieceHoverMovementEffect();
}


//Randomly select a legal move
function computerMakesMove(){

    let selectedPiece = null;

    while(selectedPiece == null){
        
        const randomSelector = Math.floor(Math.random() * yourMoves.length);

        if(yourMoves[randomSelector].availableCaptures.length > 0 || yourMoves[randomSelector].availableSquares.length > 0 || yourMoves[randomSelector].castelSquare.length > 0 || yourMoves[randomSelector].availableCaptures.length > 0){
            selectedPiece = yourMoves[randomSelector];
        }
   }

   const allLegalSquares = [...selectedPiece.availableCaptures, ...selectedPiece.availableSquares, ...selectedPiece.castelSquare, ...selectedPiece.unphasantSquare];

   const randomMove = allLegalSquares[Math.floor(Math.random() * allLegalSquares.length)];

   movedSquare = randomMove;
   clickedPieceDetails = selectedPiece;

   if(clickedPieceDetails.availableCaptures.includes(movedSquare) || clickedPieceDetails.unphasantSquare.includes(movedSquare)){
    captureAudio.play();
   }
   else if(clickedPieceDetails.availableSquares.includes(movedSquare)){
    moveAudio.play();
   }
   else{
    castlingAudio.play();
   }

   if((clickedPieceDetails.pieceName == 'P' || clickedPieceDetails.pieceName == 'p') && ((movedSquare >= 57 && movedSquare <= 64) || (movedSquare >= 1 && movedSquare <= 8))){


        if(clickedPieceDetails.pieceName == 'P' && (movedSquare >= 57 && movedSquare <= 64)){
            const promotionChoices = ['R', 'B', 'Q', 'N'];
            gameStarterWithFenPos(promotionChoices[Math.floor(Math.random() * promotionChoices.length)]);
        }

        else if(clickedPieceDetails.pieceName == 'p' && (movedSquare >= 1 && movedSquare <= 8)){
            const promotionChoices = ['r', 'b', 'q', 'n'];
            gameStarterWithFenPos(promotionChoices[Math.floor(Math.random() * promotionChoices.length)]);
        }
    }

    else{
        gameStarterWithFenPos(null);
    }
}

//hover effect in own pieces
function ownPieceHoverMovementEffect(){

    const chessBoardElement = document.getElementsByClassName('newChessBrd')[0];

    let ownPiecesSquare = [];
    let kingSquare;

    for(let i = 0; i < yourMoves.length; i++){
        ownPiecesSquare.push(yourMoves[i].currentSquare);
        if(yourMoves[i].pieceName == 'k' || yourMoves[i].pieceName == 'K'){
            kingSquare = yourMoves[i].currentSquare;
        }
    }

    const rank = [8, 7, 6, 5, 4, 3, 2, 1];
    const file = [1, 2, 3, 4, 5, 6, 7, 8];

    for(let i = 0; i < chessBoardElement.childNodes.length; i++){

        for(let j = 0; j < chessBoardElement.childNodes[i].childNodes.length; j++){

            const currentBoardEle = chessBoardElement.childNodes[i].childNodes[j];
            const currentBg = currentBoardEle.style.backgroundColor;

            let ranks = rank[i];
            let files = file[j];

            const currentSquare = (ranks * 8) - (8 - files);

            //Highlights king if it is in check
            if(check && currentSquare == kingSquare){
                currentBoardEle.style.backgroundColor = "#5B5EA6";
            }

            //If mouse enters in own piece area, highlights the square
            currentBoardEle.addEventListener('mouseenter', () =>{

                if(ownPiecesSquare.includes(currentSquare)){
                    currentBoardEle.style.backgroundColor = "#98B4D4";
                }
            });

            //If mouse leaves own piece of highlighted square, changes to normal color
            currentBoardEle.addEventListener('mouseleave', () =>{

                if(ownPiecesSquare.includes(currentSquare)){
                    currentBoardEle.style.backgroundColor = currentBg;
                }
                if(check && currentSquare == kingSquare){
                    currentBoardEle.style.backgroundColor = "#5B5EA6";
                }
            });

            currentBoardEle.addEventListener('click', () =>{

                clickedOnYourPiece(currentSquare, ownPiecesSquare);
            });
        }
    }
}

//Player clicks in pieces, moves or empty squares
function clickedOnYourPiece(currentSquare, ownPiecesSquare){

    //Own Piece Selected
    if(ownPiecesSquare.includes(currentSquare)){

        boardSetup();
        ownPieceHoverMovementEffect();

        clickedPieceDetails = findPieceByCurrentSquare(currentSquare);
        highLightMovescaptures();
    }

    //If clicked in moveable square or capturable squares
    else if(clickedPieceDetails != null){

        //If player selected a moveable or capturable squares
        if(clickedPieceDetails.availableCaptures.includes(currentSquare) || clickedPieceDetails.availableSquares.includes(currentSquare) || clickedPieceDetails.castelSquare.includes(currentSquare) || clickedPieceDetails.unphasantSquare.includes(currentSquare)){

            if(clickedPieceDetails.availableSquares.includes(currentSquare)){
                moveAudio.play();
            }
            else if(clickedPieceDetails.availableCaptures.includes(currentSquare) || clickedPieceDetails.unphasantSquare.includes(currentSquare)){
                captureAudio.play();
            }
            else if(clickedPieceDetails.castelSquare.includes(currentSquare)){
                castlingAudio.play();
            }
            
            //Player created a legal move Update for database entry
            //__________________________________________________________________________________________________
            //________________________________________Player Moved______________________________________________
            //__________________________________________________________________________________________________

            movedSquare = currentSquare;
            //for now lets continue in generateFenPosition function
            generateFenPosition();
        }
        //Player seleted some other squares then previously selected peice
        else{
            clickedPieceDetails = null;
            boardSetup();
            ownPieceHoverMovementEffect();
        }
    }
}

//Highlights all the moveable and capturable squares
function highLightMovescaptures(){

    const chessBoardElement = document.getElementsByClassName('newChessBrd')[0];

    const rank = [8, 7, 6, 5, 4, 3, 2, 1];
    const file = [1, 2, 3, 4, 5, 6, 7, 8];

    for(let i = 0; i < chessBoardElement.childNodes.length; i++){

        for(let j = 0; j < chessBoardElement.childNodes[i].childNodes.length; j++){

            const currentBoardElement = chessBoardElement.childNodes[i].childNodes[j];

            let ranks = rank[i];
            let files = file[j];

            const currentSquare = (ranks * 8) - (8 - files);

            if(clickedPieceDetails.availableSquares.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#009B77";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.availableCaptures.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#DD4124";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.castelSquare.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#B565A7";
                currentBoardElement.style.border = "2px solid black";
            }
            if(clickedPieceDetails.unphasantSquare.includes(currentSquare)){
                currentBoardElement.style.backgroundColor = "#DD4124";
                currentBoardElement.style.border = "2px solid black";
            }
        }
    }
}

function findPieceByCurrentSquare(currentSquare){
    for(let i = 0; i < yourMoves.length; i++){
        if(yourMoves[i].currentSquare == currentSquare){
            return yourMoves[i];
        }
    }
}

//_______________________________________________________________________________________________________________
//____________________________Update For Promoting to other pieces_______________________________________________
//_______________________________________________________________________________________________________________
function generateFenPosition(){

    let pawnPromotedTo = null;

    if((clickedPieceDetails.pieceName == 'P' || clickedPieceDetails.pieceName == 'p') && ((movedSquare >= 57 && movedSquare <= 64) || (movedSquare >= 1 && movedSquare <= 8))){

        const movedElement = document.getElementsByClassName(movedSquare)[0];
        const promotionOption = pawnPromotionOptions();

        if(clickedPieceDetails.pieceName == 'P' && (movedSquare >= 57 && movedSquare <= 64)){

            while(movedElement.firstChild){
                movedElement.removeChild(movedElement.firstChild);
            }
            movedElement.appendChild(promotionOption);

            const rookPromotion = document.getElementsByClassName('rookSelected')[0];
            const bishopPromotion = document.getElementsByClassName('bishopSelected')[0];
            const queenPromotion = document.getElementsByClassName('queenSelected')[0];
            const nightPromotion = document.getElementsByClassName('nightSelected')[0];

            rookPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('R');
            });
            bishopPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('B');
            });
            queenPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('Q');
            });
            nightPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('N');
            });
        }

        else if(clickedPieceDetails.pieceName == 'p' && (movedSquare >= 1 && movedSquare <= 8)){

            while(movedElement.firstChild){
                movedElement.removeChild(movedElement.firstChild);
            }
            promotionOption.style.transform = "rotate(180deg)";
            
            movedElement.appendChild(promotionOption);

            const rookPromotion = document.getElementsByClassName('rookSelected')[0];
            const bishopPromotion = document.getElementsByClassName('bishopSelected')[0];
            const queenPromotion = document.getElementsByClassName('queenSelected')[0];
            const nightPromotion = document.getElementsByClassName('nightSelected')[0];

            rookPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('r');
            });
            bishopPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('b');
            });
            queenPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('q');
            });
            nightPromotion.addEventListener('click', () => {
                gameStarterWithFenPos('n');
            });
        }
    }
    else{
        gameStarterWithFenPos(null);
    }
}

function gameStarterWithFenPos(piecePromo){
    
    const updatedFenPositionGeneratorObj = new UpdatedFenPositionGenerator(chessBoardArray, movedSquare, clickedPieceDetails, fenPosition, castelDetails, piecePromo);
    const updatedFenPosition = updatedFenPositionGeneratorObj.returnUpdatedFenPosition();
    const updatedCastelInformations = updatedFenPositionGeneratorObj.returnUpdatedCastelInfos();

    startNewPosition(updatedFenPosition, updatedCastelInformations);
}

function pawnPromotionOptions(){

    const mainDiv = document.createElement('div');
    mainDiv.className = "pawnPromotionOption";
    
    const rookButton = document.createElement('div');
    rookButton.className = "rookSelected";
    const rookText = "Rook";
    rookButton.textContent = rookText;

    const nightButton = document.createElement('div');
    nightButton.className = "nightSelected";
    const nightText = "Night";
    nightButton.textContent = nightText;

    const bishopButton = document.createElement('div');
    bishopButton.className = "bishopSelected";
    const bishopText = "Bishop";
    bishopButton.textContent = bishopText;

    const queenButton = document.createElement('div');
    queenButton.className = "queenSelected";
    const queenText = "Queen";
    queenButton.textContent = queenText;

    mainDiv.appendChild(rookButton);
    mainDiv.appendChild(nightButton);
    mainDiv.appendChild(bishopButton);
    mainDiv.appendChild(queenButton);

    return mainDiv;
}

document.addEventListener('DOMContentLoaded', pawnPromotionOptions);

//Starts moving chess board with new Fen Position
function startNewPosition(updatedFenPosition, updatedCastelInformations){
    apiInfos.fenPosition = updatedFenPosition;
    apiInfos.castelDetails = updatedCastelInformations;

    clearGlobals();

    mainEventLoader(apiInfos);
    main();
}

function clearGlobals(){

    //globals for board presentation
    fenPosition = "";
    playerColor = "";
    castelDetails = {};

    //for moves detection
    chessBoardArray = new Array(64);
    piecesMoveDetectionArray = new Array(120);

    //All the legal moves of both player
    yourMoves = [];
    opponentMoves = [];

    //Game current Status;
    check = false;
    checkmate = false;
    stalemate = false;

    //If player selects a piece to move
    clickedPieceDetails = null;
    movedSquare = 0;
}