//suppose game starts by receiving API apiObject
function main(){

    //Find all the legal Moves of both player
    let legalMovesCaptures = fillAllLeagalMoves(fenPosition);

    yourMoves = legalMovesCaptures[0];
    opponentMoves = legalMovesCaptures[1];

    //check game status: check, stalemate or checkmate
    const boardStatus = currentGameStatusChecker(fenPosition, yourMoves, opponentMoves);

    check = boardStatus[0];
    checkmate = boardStatus[1];
    stalemate = boardStatus[2];

    //show board in browser
    boardSetup();

    //time is not over
    if(whiteRemainingTime > 0 && blackRemainingTime > 0 && !checkmate && !stalemate){

        clearInterval(whiteTimeInterval);
        clearInterval(blackTimeInterval);

        let timeInTextBlack = secondToTime(blackRemainingTime);
        let timeInTextWhite = secondToTime(whiteRemainingTime);

        const whiteTimeArea = document.getElementsByClassName('time-details-white')[0];
        const blackTimeArea = document.getElementsByClassName('time-details-black')[0];

        if(fenPosition.split(" ")[1] == 'w'){

            //If it is white turn to move update black time
            changeTextInHtml(blackTimeArea, timeInTextBlack);

            whiteTimeInterval = setInterval(() => {
                if(whiteRemainingTime > 0){

                    whiteRemainingTime--;
                    timeInTextWhite = secondToTime(whiteRemainingTime);
                    changeTextInHtml(whiteTimeArea, timeInTextWhite);
                    
                }
                else{

                    clearInterval(whiteTimeInterval);
                    main();
                }
            }, 1000);
            
        }
        else if(fenPosition.split(" ")[1] == 'b'){

            changeTextInHtml(whiteTimeArea, timeInTextWhite);

            blackTimeInterval = setInterval(() => {

                if(blackRemainingTime > 0){

                    blackRemainingTime--;
                    timeInTextBlack = secondToTime(blackRemainingTime);
                    changeTextInHtml(blackTimeArea, timeInTextBlack);
                    
                }
                else{

                    clearInterval(blackTimeInterval);
                    main();
                }
            }, 1000);
        }
    }
    else if(whiteRemainingTime == 0 && blackRemainingTime == 0){
        timeOver = true;
    }

    //If current game Status is normal make a move
    if(!checkmate && !stalemate && !timeOver){

        if(apiInfos.currentMove != null){
            
            if(check){
                checkAudio.play();

            }
            else if(apiInfos.currentMove.split(" ")[0].length > 1){
                captureAudio.play();
            }
            else{
                moveAudio.play();
            }
        }

        //either your id should match black player or white player to make a move
        if(fenPosition.split(" ")[1] == playerColor && (yourId == apiInfos.playerWhiteId || yourId == apiInfos.playerBlackId)){

            //Make board moveable for player
            ownPieceHoverMovementEffect();
        }
    }
    else{

        let blackPlayerRating = mainApiInfo.playerBlackRating;
        let whitePlayerRating = mainApiInfo.playerWhiteRating;
        let message = "";

        if(timeOver){
            drawAudio.play();

            //white lost game
            if(whiteRemainingTime == 0){

                message = "White Lost In Time";

                blackPlayerRating += 4;
                if(whitePlayerRating > 300){
                    blackPlayerRating -= 4;
                }

            }
            //black lost game
            else{
                message = "Black Lost In Time";

                whitePlayerRating += 4;
                if(blackPlayerRating > 300){
                    blackPlayerRating -= 4;
                }
            }


            //Insert value in DB
        }
        else if(checkmate){

            //If checkmate play audio
            if(checkmate){
                checkmateAudio.play();
            }

            const finalMove = apiInfos.currentMove;
            let winningPlayer = finalMove.split(" ")[3];

            if(winningPlayer == 'b'){

                message = "Black Won By Checkmate";

                blackPlayerRating += 4;
                if(whitePlayerRating > 300){
                    blackPlayerRating -= 4;
                }

            }
            //black lost game
            else{
                message = "White Won By Checkmate";

                whitePlayerRating += 4;
                if(blackPlayerRating > 300){
                    blackPlayerRating -= 4;
                }
            }
        }

        else if(stalemate){
            drawAudio.play();
            message = "Match Ended In Draw";

            if(whitePlayerRating > 300){
                whitePlayerRating -= 1;
            }
            if(blackPlayerRating > 300){
                blackPlayerRating -= 1;
            }
        }

        const requiredData = {
            "playerBlackId" : apiInfos.playerBlackId,
            "playerWhiteId" : apiInfos.playerWhiteId,
            "updatedWhiteId" : whitePlayerRating,
            "updatedBlackId" : blackPlayerRating,
            "matchId" : mainApiInfo.channelNumber,
            "gameType" : mainApiInfo.gameType
        };

        setTimeout(function() {showPlayersFinalRating(blackPlayerRating, whitePlayerRating, message)}, 2000);
        broadCastAndRecordMove(requiredData, "/matchOver", "POST");

        boardSetup();
        clearGlobals();

        console.log("Game Over");
        console.log(message);
    }
}

function showPlayersFinalRating(blackPlayerRating, whitePlayerRating, message){

    const resultcontainer =  document.getElementsByClassName('match-over-message')[0];
    const finalResultDiv = document.getElementsByClassName('final-rating')[0];

    const contentDiv = document.getElementsByClassName('main-container')[0];

    const messageHeading = document.createElement('h1');
    messageHeading.textContent = message;

    //create heading and store these messages and append them to finalResultDiv
    const resultHead1 = document.createElement('h1');
    resultHead1.textContent = "Black player rating: " + blackPlayerRating;

    const resultHead2 = document.createElement('h1');
    resultHead2.textContent = "White player rating: " + whitePlayerRating;

    resultcontainer.style.display = "block";

    finalResultDiv.appendChild(messageHeading);
    finalResultDiv.appendChild(resultHead1);
    finalResultDiv.appendChild(resultHead2);

    contentDiv.className += " blure";

    console.log(message);
}

//Just fill the fenPosition and player color and board is presented
function boardSetup(){

    const chessBoardHolder = document.getElementsByClassName('chessBrd-area')[0];
    const board = currentBoardPosition(fenPosition, playerColor);

    while(chessBoardHolder.firstChild){
        chessBoardHolder.removeChild(chessBoardHolder.firstChild);
    }

    //If previous move exist make it visible in chess board
    if(apiInfos.currentMove != null){
        //making array of current move and high lighting its square
        const move = apiInfos.currentMove.split(" ");

        console.log(move);

        const sq1 = board.getElementsByClassName(move[1])[0];
        const sq2 = board.getElementsByClassName(move[2])[0];


        sq1.style.backgroundColor = "grey";
        sq1.style.border = "2px solid black";

        sq2.style.backgroundColor = "grey";
        sq2.style.border = "2px solid black";

        if(check){
            //highlight king sq.

            let kingSquare;
            let currentPlayer = fenPosition.split(" ")[1];

            for(let i = 0; i < yourMoves.length; i++){

                if(currentPlayer == 'w' && yourMoves[i].pieceName == 'K'){
                    kingSquare = yourMoves[i].currentSquare;
                    break;
                }
                else if(currentPlayer == 'b' && yourMoves[i].pieceName == 'k'){
                    kingSquare = yourMoves[i].currentSquare;
                    break;
                }
            }

            board.getElementsByClassName(kingSquare)[0].style.backgroundColor = "#5B5EA6";
        }

    }

    chessBoardHolder.appendChild(board);
}

//Pass the fen Position and player color and get chess board with current fen position
function currentBoardPosition(fenPos, color){

    const brdFirstColor = '#b48766';
    const brdSecondColor = '#edd9b6';
    const brdheight = 600;
    const brdWidth = 600;

    //Object of ChessBoard for empty chess board
    const boardObj = new BlankChessBoard(brdFirstColor , brdSecondColor, brdheight, brdWidth);
    const emptyBoard = boardObj.createBoard();

    //board appended to empty chess board
    const brdWithPiecesObj = new ChessPieceSetter(emptyBoard, fenPos, color);
    let brdWithPieces = brdWithPiecesObj.setPieces();

    return brdWithPieces;
}

//Finds all the legal moves and fills to yourMoves and opponentMoves in globals with respect to currentPlayerToMove
function fillAllLeagalMoves(fenPos){

    const currentPlayerToMove = fenPos.split(" ")[1];
    const chessBoardArrayFillerObj = new ChessBoardArrayFiller(fenPos);

    chessBoardArray = chessBoardArrayFillerObj.fillChessBoardArray();
    piecesMoveDetectionArray = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(chessBoardArray);

    const gameStatusCheckerObj = new GameStatusChecker();
    const filterMovesObj = new FilterMoves(gameStatusCheckerObj, currentPlayerToMove, chessBoardArray, piecesMoveDetectionArray, fenPos, castelDetails);

    const legalMovesCaptures = filterMovesObj.filteredMoves();

    return legalMovesCaptures;
}

//Finds game status of curret player to make a move
function currentGameStatusChecker(fenPos, yourM, oppM){

    //Find whose turn to move
    const currentPlayerToMove = fenPos.split(" ")[1];
    const gameStatusCheckerObj = new GameStatusChecker();

    //check if its check, checkmate or stalemate
    const check = gameStatusCheckerObj.findCheck(currentPlayerToMove, yourM, oppM);
    const checkmate = gameStatusCheckerObj.findCheckmate(yourM, check);
    const stalemate = gameStatusCheckerObj.findStalemate(fenPos, yourM, check, oppM);

    return [check, checkmate, stalemate];
}


//hover effect in own pieces
function ownPieceHoverMovementEffect(){

    //Brd element for looping through all the square
    const chessBoardElement = document.getElementsByClassName('newChessBrd')[0];

    //Get all the square that has our piece
    let ownPiecesSquare = [];

    for(let i = 0; i < yourMoves.length; i++){
        ownPiecesSquare.push(yourMoves[i].currentSquare);
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

    console.log(clickedPieceDetails);

    apiInfos.startingFenPosition = fenPosition;
    apiInfos.finalFenPosition = updatedFenPosition;
    apiInfos.castelDetails = updatedCastelInformations;
    mainApiInfo.whiteRemainingTime = whiteRemainingTime;
    mainApiInfo.blackRemainingTime = blackRemainingTime;

    console.log(apiInfos);

    let currentMove;

    //Piece captured
    if(clickedPieceDetails.availableCaptures.includes(movedSquare) || clickedPieceDetails.unphasantSquare.includes(movedSquare)){
        currentMove = clickedPieceDetails.pieceName + "x " + clickedPieceDetails.currentSquare + " " + movedSquare;
    }
    //only piece movement
    else if(clickedPieceDetails.availableSquares.includes(movedSquare) || clickedPieceDetails.castelSquare.includes(movedSquare)){
        currentMove = clickedPieceDetails.pieceName + " " + clickedPieceDetails.currentSquare + " " + movedSquare;
    }


    //check checkmate or stalemate in updated position and modify currentMove if required
    const yourAndOppMoves = fillAllLeagalMoves(updatedFenPosition);
    const finalFenPosStatus = currentGameStatusChecker(updatedFenPosition, yourAndOppMoves[0], yourAndOppMoves[1]);

    //if checkmate find winning player

    let playerWinning;

    //if current player is white and checkmate
    if(fenPosition.split(" ")[1] == "b" && finalFenPosStatus[1]){
        playerWinning = "b";
    }
    else{
        playerWinning = "w";
    }

    console.log('Current checkMate: ' + finalFenPosStatus[1] + " current stalemate: " + finalFenPosStatus[2]);
    //checkmates
    if(finalFenPosStatus[1]){
        currentMove += " " + playerWinning + " W";
    }
    //stalemate
    else if(finalFenPosStatus[2]){
        currentMove += " D";
    }

    apiInfos.castelDetails = updatedCastelInformations;
    apiInfos.currentMove = currentMove;

    mainApiInfo.apiObject = apiInfos;


    clearGlobals();

    if(yourId == apiInfos.playerWhiteId || yourId == apiInfos.playerBlackId){
        //Call a post function that will insert data in database and call an event for the players
        broadCastAndRecordMove(mainApiInfo, "/playersMadeMove", "POST");
    }
}

async function broadCastAndRecordMove(requiredData, redirectURL, method){

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

function clearGlobals(){

    //globals for board presentation
    fenPosition = "";
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

    clearInterval(whiteTimeInterval);
    clearInterval(blackTimeInterval);
}

function secondToTime(second){

    let minute = (second - second % 60) / 60;
    let seconds = second % 60;

    if(minute < 10){
        minute = '0' + minute;
    }
    if(seconds < 10){
        seconds = '0' + seconds;
    }

    return  minute + ":" + seconds;
}

function changeTextInHtml(element, time){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
    element.textContent = time;
}