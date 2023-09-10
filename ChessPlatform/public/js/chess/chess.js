function main(){

    console.log(serverData);

    //Identify the type of game
    if(serverData.gameDetails.gameType == "stockfish"){
        engineGameHandler();
    }
}

function engineGameHandler(){

    //If game have just started receive first fen Position
    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];

    const playerColor = serverData.playerInfomation.playerBlackId == serverData.playerInfomation.yourId ? 'b' : 'w';

    //Required Objects
    const mainEventHandlerObj = new MainChessController(currentFenPosition, serverData.boardDetails.castelDetails);
    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);

    const gamePlayable = mainEventHandlerObj.evaluateFenPosition();

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    chessElementHandlerObj.getBoardWithPieces();

    if(serverData.boardDetails.allMove.length > 0){
        chessElementHandlerObj.setBoardWithMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1]);

        playSoundBasedOnMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1], mainEventHandlerObj.getCurrentStatus()[0]);
    }
    let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();
    
    if(gamePlayable){

        //Find if it is player to move
        if(currentFenPosition.split(" ")[1] == playerColor){

            //Now do all the action related to board on browser Get valid move in return
            const currentPlayersAllLegalMoves = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];

            let playersMovedPieceAndSquare = findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null);

            //Only Continue if player makes a valid Move
            playersMovedPieceAndSquare.then(function(val){

                //val variable will be having three items in array [movedPieceDetails, movedNumber, piecePromotion]
                console.log("Your valid move is: ", val);

                //Set updated Fen position
                mainEventHandlerObj.setUpdatedFenPositionAndCastelPerms(val);
                mainEventHandlerObj.setUpdatedFenPositionStatus();
                mainEventHandlerObj.setCurrentMove(val);

                const newFenPosition = mainEventHandlerObj.getUpdatedFenPosition();
                const newCastelDetails = mainEventHandlerObj.getUpdatedCastelPerms();
                const currentMove = mainEventHandlerObj.getCurrentMove();

                
                //Insert this data in database
                

                //continue game with new position with stockfish move
                serverData.boardDetails.allMove.push(currentMove);
                serverData.boardDetails.allfinalFenPosition.push(newFenPosition);
                serverData.boardDetails.castelDetails = newCastelDetails;

                
                main();

            });
            

        }
        else{

            chessElementHandlerObj.clearParentElement(boardContainer);
            chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);

            const getOrPostRequestObj = new GetOrPostRequest();

            const nodeServerUrl = 'http://localhost:3000';

            console.log("Stockfish Is Thinking");
            getOrPostRequestObj.getBestMove(currentFenPosition, parseInt(serverData.gameDetails.level) * 3, nodeServerUrl)
            .then(function (val) {

                console.log("Stockfish Found Best Move");
                const bestMoveOfEngine = val;

                //convert this move to find [pieceArray, movedSquare, pawnPromotion]
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
        }
   }
}

//If user chooses valid moves return [pieceDetails, movedSqNum, promotedPiece]
//Required these globals for pieceMovement detection
let clickedPiece = null;
let movedSquare = null;
let piecePromotion = null;

function findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, selectedPiece){

    return new Promise((resolve, reject) => {
           //Make Board Moveable
    const cloneHtmlBoard = htmlBoardElement.cloneNode(true);

    //show the cloned board
    chessElementHandlerObj.clearParentElement(boardContainer);
    chessElementHandlerObj. placeChildElementInParentElement(cloneHtmlBoard, boardContainer);

    if(selectedPiece != null){
        
        showAllMovesAndCaptures(selectedPiece);
    }

    const rank = [8, 7, 6, 5, 4, 3, 2, 1];
    const file = [1, 2, 3, 4, 5, 6, 7, 8];

    const ownPieceSquares = currentPlayersAllLegalMoves.map(obj => obj.currentSquare); 

    //loop through all the squares and make it hoverable and moveable for player
    for(let RANKS = 0; RANKS < cloneHtmlBoard.childNodes.length; RANKS++){
        for(let FILES = 0; FILES < cloneHtmlBoard.childNodes[RANKS].childNodes.length; FILES++){

            const currentBoardEle = cloneHtmlBoard.childNodes[RANKS].childNodes[FILES];
            const currentBg = currentBoardEle.style.backgroundColor;

            let ranks = rank[RANKS];
            let files = file[FILES];

            const currentSquare = (ranks * 8) - (8 - files);

            if(ownPieceSquares.includes(currentSquare)){
    
                //If pointer enters in own piece square
                currentBoardEle.addEventListener('mouseenter', () =>{

                    currentBoardEle.style.backgroundColor = "#98B4D4";
                });
                //If pointer leaves in own piece square
                currentBoardEle.addEventListener('mouseleave', () =>{

                    currentBoardEle.style.backgroundColor = currentBg;
                });
            }

             currentBoardEle.addEventListener('click', () => {

                //receiving piece of square accordingly
                let tempReceiver = trackClickOnBoardSquare(currentSquare, currentPlayersAllLegalMoves);

                //You receive and object here
                if(typeof tempReceiver == 'object' ){

                    //If player clicked for first time in piece
                    if(clickedPiece == null){
                        //Show selected squares
                        clickedPiece = tempReceiver;
                        showAllMovesAndCaptures(clickedPiece);
                    }
                    else{
                        //Update Board with initial selected piece and Update clickedPiece
                        clickedPiece = tempReceiver;
                        resolve(findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, clickedPiece));
                    }
                }
                //You receive a number here
                else{
                    if(clickedPiece == null){
                        //Update Board with null value for selected piece
                        //recursively call the function again with null initially selected piece
                        resolve(findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null));
                    }
                    else{
                        //check if player selected correct square
                        //if not selected correct update board
                        movedSquare = tempReceiver;

                        if(clickedPiece.availableCaptures.includes(movedSquare) || clickedPiece.availableSquares.includes(movedSquare) || clickedPiece.castelSquare.includes(movedSquare) || clickedPiece.unphasantSquare.includes(movedSquare) ){

                            let piecePromotedTo = null;

                            if((clickedPiece.pieceName == 'p' && (movedSquare >= 1 && movedSquare <= 8)) || (clickedPiece.pieceName == 'P' && (movedSquare >= 57 && movedSquare <= 64))){

                                const pormotedInfo = providePromotingOptions();
                                pormotedInfo.then(function(val) {

                                    if(val == -1){
                                        resolve(findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null));
                                    }
                                    else if(clickedPiece.pieceName == 'P'){
                                        resolve([clickedPiece, movedSquare, val.toUpperCase()]);
                                    }
                                    else if(clickedPiece.pieceName == 'p'){
                                        resolve([clickedPiece, movedSquare, val]);
                                    }
                                });
                            }
                            else{
                                resolve([clickedPiece, movedSquare, piecePromotedTo]);
                            }

                            
                        }
                        else{
                            resolve(findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null));
                        }
                    }
                }
            });
        }
    }
    });
 
}

function providePromotingOptions(){

    return new Promise((resolve, reject) => {
        const options = document.getElementsByClassName('matching-player-infos')[0];
        const mainContainer = document.getElementsByClassName('main-container')[0];
    
        options.style.display = 'block';
        mainContainer.className += " blure";
    
        const cross = document.getElementsByClassName('sign-cross')[0].getElementsByTagName('span')[0];
        cross.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-container";

            resolve(-1);
        });

        const optQueen = document.getElementsByClassName('OptQueen')[0];
        const optBishop = document.getElementsByClassName('OptBishop')[0];
        const optNight = document.getElementsByClassName('OptNight')[0];
        const optRook = document.getElementsByClassName('OptRook')[0];

        optQueen.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-container";

            resolve('q');
        });
        optBishop.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-container";

            resolve('b');

        });
        optNight.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-container";

            resolve('n');

        });
        optRook.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-container";

            resolve('r');
        });
    });
}

function trackClickOnBoardSquare(clickedSquare, currentPlayersAllLegalMoves){

    const foundObject = currentPlayersAllLegalMoves.find(obj => obj.currentSquare == clickedSquare);
    return foundObject !== undefined ? foundObject : clickedSquare;
}

function showAllMovesAndCaptures(selectedPiece){

    for(let i = 0; i < selectedPiece.availableCaptures.length; i++){
        const tempEle = document.getElementsByClassName(selectedPiece.availableCaptures[i])[0];

        tempEle.style.backgroundColor = "#DD4124";
        tempEle.style.border = "2px solid black";
    }

    for(let i = 0; i < selectedPiece.availableSquares.length; i++){
        const tempEle = document.getElementsByClassName(selectedPiece.availableSquares[i])[0];

        tempEle.style.backgroundColor = "#009B77";
        tempEle.style.border = "2px solid black";
    }
    for(let i = 0; i < selectedPiece.castelSquare.length; i++){
        const tempEle = document.getElementsByClassName(selectedPiece.castelSquare[i])[0];

        tempEle.style.backgroundColor = "#B565A7";
        tempEle.style.border = "2px solid black";
    }

    for(let i = 0; i < selectedPiece.unphasantSquare.length; i++){
        const tempEle = document.getElementsByClassName(selectedPiece.unphasantSquare[i])[0];

        tempEle.style.backgroundColor = "#DD4124";
        tempEle.style.border = "2px solid black";
    }
}

function playSoundBasedOnMove(move, check){
    
    const moveAudio = new Audio('/Sounds/move.mp3');
    const captureAudio = new Audio('/Sounds/Capture.mp3');
    const checkAudio = new Audio('/Sounds/Check.mp3');
    const castlingAudio = new Audio('/Sounds/Castling.mp3');
    const checkmateAudio = new Audio('/Sounds/Checkmate.mp3');
    const drawAudio = new Audio('/Sounds/Draw.mp3');

    const moveNotation = move.split(" ");

    //play Draw
    if(moveNotation.length == 4){
        drawAudio.play();
    }
    else if(moveNotation.length == 5){
        checkmateAudio.play();
    }
    else if(check){
        checkAudio.play();
    }
    else if(moveNotation[0].length == 1){
        moveAudio.play();
    }
    else if(moveNotation[0].length == 2 && moveNotation[0][1] == 'x'){
        captureAudio.play();
    }
    else if(moveNotation[0].length == 2 && moveNotation[0][1] == 'c'){
        castlingAudio.play();
    }

}

document.addEventListener('DOMContentLoaded', main);