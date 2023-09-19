function main(){
    //Identify the type of game
    if(serverData.gameDetails.gameType == "stockfish"){

        if (!hintButtonInitialized) {
            initializeHintButtonListener();
            hintButtonInitialized = true;
        }

        initialEngineMatchSetUp();
        engineGameHandler();
    }
    else if(serverData.gameDetails.gameType == "blitz" || serverData.gameDetails.gameType == "bullet" || serverData.gameDetails.gameType == "classic"){

        initialBtnSetup = null;
        initialBtnSetup = initialOnlineMatchSetup();
        
        multiplayerGameHandler();
    }
    else if(serverData.gameDetails.gameType == "puzzle"){
        const totalMoves = serverData.gameDetails.mateInMove * 2 - 1;
        const remainingMoves = totalMoves - serverData.boardDetails.allMove.length;

        if (!hintButtonInitialized) {
            initializeHintButtonListener();
            hintButtonInitialized = true;
        }

        if(remainingMoves >= 0){
            initialEngineMatchSetUp();
            engineGameHandler();
        }
        else{
            checkPuzzleStatusShowMessage();
        }
    }
}

function checkPuzzleStatusShowMessage(){

    const puzzleFailed = new Audio('/Sounds/Draw.mp3');
    puzzleFailed.play();

    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];
    const playerColor = serverData.playerInfomation.playerBlackId == serverData.playerInfomation.yourId ? 'b' : 'w';

    const mainEventHandlerObj = new MainChessController(currentFenPosition, serverData.boardDetails.castelDetails);
    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);

    const gameStatus = mainEventHandlerObj.getCurrentStatus();

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const movesHolder = document.getElementsByClassName('moves-details-wrapper')[0];

    chessElementHandlerObj.getBoardWithPieces();

        //If player have played at least one moves
        if(serverData.boardDetails.allMove.length > 0){

            chessElementHandlerObj.setBoardWithMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1]);
    
            //Checkmate
            if(gameStatus[0] || gameStatus[1]){
    
                let kingSquare;
                pieceArray = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];
                if(currentFenPosition.split(" ")[1] == 'w'){
                    kingSquare = pieceArray.find(piece => piece.pieceName === 'K')?.currentSquare;
                }
                else{
                    kingSquare = pieceArray.find(piece => piece.pieceName === 'k')?.currentSquare;
                }
                
                chessElementHandlerObj.setBoardWithCheckedSquarePieces(kingSquare);
            }
        }
    
        const movesInDivs = chessElementHandlerObj.createMoveElements(serverData.boardDetails.allMove);
    
        chessElementHandlerObj.clearParentElement(movesHolder);
        chessElementHandlerObj. placeChildElementInParentElement(movesInDivs, movesHolder);
    
        let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();
    
        //Manage Hint for player
        chessElementHandlerObj.clearParentElement(boardContainer);
        chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);
}


//For hint access
let globalFenPos;
async function engineGameHandler(){

    //If game have just started receive first fen Position
    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];

    //For access of hint
    globalFenPos = currentFenPosition;

    const playerColor = serverData.playerInfomation.playerBlackId == serverData.playerInfomation.yourId ? 'b' : 'w';

    //Required Objects
    const mainEventHandlerObj = new MainChessController(currentFenPosition, serverData.boardDetails.castelDetails);
    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);
    const getOrPostRequestObj = new GetOrPostRequest();

    //Check If game is playable or not
    const gamePlayable = mainEventHandlerObj.evaluateFenPosition();
    const gameStatus = mainEventHandlerObj.getCurrentStatus();

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const movesHolder = document.getElementsByClassName('moves-details-wrapper')[0];
    
    chessElementHandlerObj.getBoardWithPieces();

    //If player have played at least one moves
    if(serverData.boardDetails.allMove.length > 0){

        chessElementHandlerObj.setBoardWithMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1]);

        //Checkmate
        if(gameStatus[0] || gameStatus[1]){

            let kingSquare;
            pieceArray = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];
            if(currentFenPosition.split(" ")[1] == 'w'){
                kingSquare = pieceArray.find(piece => piece.pieceName === 'K')?.currentSquare;
            }
            else{
                kingSquare = pieceArray.find(piece => piece.pieceName === 'k')?.currentSquare;
            }
            
            chessElementHandlerObj.setBoardWithCheckedSquarePieces(kingSquare);
        }
        playSoundBasedOnMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1], gameStatus[0]);
    }

    const movesInDivs = chessElementHandlerObj.createMoveElements(serverData.boardDetails.allMove);

    chessElementHandlerObj.clearParentElement(movesHolder);
    chessElementHandlerObj. placeChildElementInParentElement(movesInDivs, movesHolder);

    let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();

    //Manage Hint for player
    
    chessElementHandlerObj.clearParentElement(boardContainer);
    chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);

    if(gamePlayable){

        //Find if it is player to move
        if(currentFenPosition.split(" ")[1] == playerColor){

            //Now do all the action related to board on browser Get valid move in return
            const currentPlayersAllLegalMoves = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];

            let playersMovedPieceAndSquare = findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null);

            //Only Continue if player makes a valid Move
            playersMovedPieceAndSquare.then(function(val){

                //val variable will be having three items in array [movedPieceDetails, movedNumber, piecePromotion]
                //Set updated Fen position
                mainEventHandlerObj.setUpdatedFenPositionAndCastelPerms(val);
                mainEventHandlerObj.setUpdatedFenPositionStatus();
                mainEventHandlerObj.setCurrentMove(val);

                const newFenPosition = mainEventHandlerObj.getUpdatedFenPosition();
                const newCastelDetails = mainEventHandlerObj.getUpdatedCastelPerms();
                const currentMove = mainEventHandlerObj.getCurrentMove();

                //continue game with new position with stockfish move
                serverData.boardDetails.allMove.push(currentMove);
                serverData.boardDetails.allfinalFenPosition.push(newFenPosition);
                serverData.boardDetails.castelDetails = newCastelDetails;

                const allFenPositions = serverData.boardDetails.allfinalFenPosition;
                const allMoves = serverData.boardDetails.allMove;

                const channelNumber = serverData.gameDetails.channelNumber;
                const gameType = serverData.gameDetails.gameType;
                const startingFenPosition = allFenPositions.length == 1 ? currentFenPosition : allFenPositions[allFenPositions.length - 2];
                const finalFenPosition = allFenPositions[allFenPositions.length - 1];
                const move = allMoves[allMoves.length - 1];

                //Record In database these details
                const requiredDataForDB = {
                    "matchNumber" : channelNumber,
                    "startingFenPosition" : startingFenPosition,
                    "finalFenPosition" : finalFenPosition,
                    "move" : move,
                }

                if(serverData.gameDetails.gameType == "stockfish"){
                    callPostMethod(requiredDataForDB, "/engineMatchMoves", "POST");
                }

                if(serverData.gameDetails.gameType == "puzzle" && move.split(" ").length == 5){

                    const data = {
                        puzzleNumber : serverData.gameDetails.channelNumber
                    }
                    
                    callPostMethod(data, "/updatePuzzleSoved", "POST");
                }

                main();
            });
        }
        else{

            chessElementHandlerObj.clearParentElement(boardContainer);
            chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);

            const nodeServerUrl = 'http://localhost:3000';

            try{
                const bestMove = await getOrPostRequestObj.getBestMove(currentFenPosition, parseInt(serverData.gameDetails.level) * 3, nodeServerUrl);

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

                serverData.boardDetails.allMove.push(currentMove);
                serverData.boardDetails.allfinalFenPosition.push(newFenPosition);
                serverData.boardDetails.castelDetails = newCastelDetails;

                //Record In database this details
                console.log("Stockfish Played: " + currentMove);

                const allFenPositions = serverData.boardDetails.allfinalFenPosition;
                const allMoves = serverData.boardDetails.allMove;

                const channelNumber = serverData.gameDetails.channelNumber;
                const gameType = serverData.gameDetails.gameType;
                const startingFenPosition = allFenPositions.length == 1 ? currentFenPosition : allFenPositions[allFenPositions.length - 2];
                const finalFenPosition = allFenPositions[allFenPositions.length - 1];
                const move = allMoves[allMoves.length - 1];

                //Record In database these details
                const requiredDataForDB = {
                    "matchNumber" : channelNumber,
                    "startingFenPosition" : startingFenPosition,
                    "finalFenPosition" : finalFenPosition,
                    "move" : move
                }

                if(serverData.gameDetails.gameType == "stockfish"){
                    callPostMethod(requiredDataForDB, "/engineMatchMoves", "POST");
                }

                setTimeout(() => {
                    main();
                }, 1500);

            }
            catch(error){
                console.error('Error:', error);
            }
        }
   }
}


function gameOver(winningPlayerColor, endingDetail){

    const gameOverMessage = document.getElementsByClassName('gameOver-popup')[0];
    const mainContainer = document.getElementsByClassName('main-chess-board-moves')[0];

    const cross = document.getElementsByClassName('sign-area-gameover')[0].getElementsByTagName('span')[0];
    const exit = document.getElementsByClassName('Game-Over-exit')[0];

    gameOverMessage.style.display = 'block';
    mainContainer.className += " blure";

    cross.addEventListener('click', () => {
        gameOverMessage.style.display = 'none';
        mainContainer.className = "main-chess-board-moves";
    });

    exit.addEventListener('click', () => {
        window.location.href = '/play';
    });

    const gameOverHeading = document.getElementsByClassName('game-over-details')[0].getElementsByTagName('h1')[0];
    gameOverHeading.textContent = endingDetail;

    const playerWhite = document.getElementsByClassName('playerWhite')[0];
    const playerBlack = document.getElementsByClassName('playerBlack')[0];

    const playerWhiteDetails = playerWhite.getElementsByTagName('h2')[0];
    const playerBlackDetails = playerBlack.getElementsByTagName('h2')[0];

    const whiteRating = serverData.playerInfomation.playerWhiteRating;
    const blackRating = serverData.playerInfomation.playerBlackRating;
    const whiteName = serverData.playerInfomation.playerWhiteName;
    const blackName = serverData.playerInfomation.playerBlackName;

    if(winningPlayerColor == 'w'){

        console.log("white won");

        playerWhite.className += " winner";
        playerBlack.className += " looser";

        playerWhiteDetails.textContent =  whiteName + " [ " + whiteRating + " + 4 ] = " + (parseInt(whiteRating) + 4);
        playerBlackDetails.textContent =  blackName + " [ " + blackRating + " - 4 ] = " + (parseInt(blackRating) - 4); 

    }
    else if(winningPlayerColor == 'b'){

        console.log("black won");

        playerWhite.className += " looser";
        playerBlack.className += " winner";

        playerBlackDetails.textContent =  blackName + " [ " + blackRating + " + 4 ] = " + (parseInt(blackRating) + 4); 
        playerWhiteDetails.textContent =  whiteName + " [ " + whiteRating + " - 4 ] = " + (parseInt(whiteRating) - 4); 
    }
    else{

        playerWhite.className += " winner";
        playerBlack.className += " winner";

        playerBlackDetails.textContent =  blackName + " [ " + blackRating + " + 0 ] = " + blackRating; 
        playerWhiteDetails.textContent =  whiteName + " [ " + whiteRating + " + 0 ] = " + whiteRating; 
    }

    //Only one player will be inserting value 
    if(winningPlayerColor != null){

        if(winningPlayerColor == 'w' && serverData.playerInfomation.yourId == serverData.playerInfomation.playerWhiteId){

            const requiredData = {
                "playerBlackId" : serverData.playerInfomation.playerBlackId,
                "playerWhiteId" : serverData.playerInfomation.playerWhiteId,
                "updatedWhiteRating" : whiteRating + 4,
                "updatedBlackRating" : blackRating - 4,
                "matchId" : serverData.gameDetails.channelNumber,
                "gameType" : serverData.gameDetails.gameType
            };

            callPostMethod(requiredData, "/updateRating", "POST");
        }
        else if(winningPlayerColor == 'b' && serverData.playerInfomation.yourId == serverData.playerInfomation.playerBlackId){
            const requiredData = {
                "playerBlackId" : serverData.playerInfomation.playerBlackId,
                "playerWhiteId" : serverData.playerInfomation.playerWhiteId,
                "updatedWhiteRating" : whiteRating - 4,
                "updatedBlackRating" : blackRating + 4,
                "matchId" : serverData.gameDetails.channelNumber,
                "gameType" : serverData.gameDetails.gameType
            };
            callPostMethod(requiredData, "/updateRating", "POST");
        }
    }
}

let initialBtnSetup;

let yourTime;
let opponentTime;

let yourTimeInterval;
let opponentTimeInterval;

function initialOnlineMatchSetup(){

    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];

    //Set your and opponent time
    yourTime = serverData.playerInfomation.yourId == serverData.playerInfomation.playerWhiteId ? serverData.boardDetails.whiteRemainingTime : serverData.boardDetails.blackRemainingTime;

    opponentTime = serverData.playerInfomation.yourId == serverData.playerInfomation.playerWhiteId ? serverData.boardDetails.blackRemainingTime : serverData.boardDetails.whiteRemainingTime;

    const yourTimeHolder = document.getElementsByClassName('your')[0];
    const oppTimeHolder = document.getElementsByClassName('opponent')[0];

    const allChats = document.getElementsByClassName('chat-details')[0];
    const allMoves = document.getElementsByClassName('moves-details')[0];

    const chatBtn = document.getElementsByClassName('btn-chat')[0];
    const movesBtn = document.getElementsByClassName('btn-move')[0];
    const exitBtn = document.getElementsByClassName('btn-leave')[0];

    chatBtn.addEventListener('click', () =>{
        allChats.style.display = 'block';
        allMoves.style.display = 'none';
    });

    movesBtn.addEventListener('click', () =>{
        allChats.style.display = 'none';
        allMoves.style.display = 'block';
    });

    exitBtn.addEventListener('click', () => {
        window.location.href = '/play';
    });

    clearInterval(yourTimeInterval);
    clearInterval(opponentTimeInterval);

    
    //Initially plce their time
    timeInTextYour = secondToTime(yourTime);
    timeInTextOpp = secondToTime(opponentTime);

    placeTextInHtml(yourTimeHolder, timeInTextYour);
    placeTextInHtml(oppTimeHolder, timeInTextOpp);

    //Find whose turn to move

    if(yourTime > 0 && opponentTime > 0){

        //If it is your turn to move
        if((currentFenPosition.split(" ")[1] == 'w' && serverData.playerInfomation.yourId == serverData.playerInfomation.playerWhiteId) || currentFenPosition.split(" ")[1] == 'b' && serverData.playerInfomation.yourId == serverData.playerInfomation.playerBlackId){
            //If you are white and it is your turn to move
            yourTimeInterval = setInterval(() => {

                timeInText = secondToTime(yourTime);
                placeTextInHtml(yourTimeHolder, timeInText);

                if(yourTime > 0){
                    yourTime--;
                }
                else{
                    clearInterval(yourTimeInterval);
                    clearInterval(opponentTimeInterval);

                    if(currentFenPosition.split(" ")[1] == 'w'){
                        serverData.boardDetails.whiteRemainingTime = 0;
                    }
                    else{
                        serverData.boardDetails.blackRemainingTime = 0;
                    }
                    main();
                }
            }, 1000);
        }
        else {
            opponentTimeInterval = setInterval(() => {

                timeInText = secondToTime(opponentTime);
                placeTextInHtml(oppTimeHolder, timeInText);

                if(opponentTime > 0){
                    opponentTime--;
                }
                else{
                    clearInterval(opponentTimeInterval);
                    clearInterval(yourTimeInterval);

                    if(currentFenPosition.split(" ")[1] == 'w'){
                        serverData.boardDetails.whiteRemainingTime = 0;
                    }
                    else{
                        serverData.boardDetails.blackRemainingTime = 0;
                    }
                    main();
                }
            }, 1000);
        }
    }

    //Chat Inplementation
    const chatInputBox = document.getElementsByClassName('textByUser')[0];
    const chatSendBtn = document.getElementsByClassName('send')[0];

    chatSendBtn.addEventListener('click', () => {

        if(chatInputBox.value != ""){
            const messageToBroadCast = {
                "id" : yourId,
                "msg" : chatInputBox.value,
                "channelNumber" : serverData.gameDetails.channelNumber
            }
            chatInputBox.value = "";

            callPostMethod(messageToBroadCast, "/playerMessaged", "POST");
        }
    });

    chatInputBox.addEventListener('keydown', (event) => {

        if (event.keyCode === 13) {
          if (chatInputBox.value !== '') {
            const messageToBroadCast = {
              'id': yourId,
              'msg': chatInputBox.value,
              'channelNumber': serverData.gameDetails.channelNumber
            };
            chatInputBox.value = '';
    
            callPostMethod(messageToBroadCast, '/playerMessaged', 'POST');
          }
        }
      });
}

function placeTextInHtml(element, time){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
    element.textContent = time;
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

async function multiplayerGameHandler(){

    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];

    //Each player will be getting their color
    const playerColor = yourId == blackId ? 'b' : 'w';

    //Required Objects
    const mainEventHandlerObj = new MainChessController(currentFenPosition, serverData.boardDetails.castelDetails);
    const chessElementHandlerObj = new ChessElementHandler(currentFenPosition, playerColor);

    //Check If game is playable or not
    const gamePlayable = mainEventHandlerObj.evaluateFenPosition();

    const gameStatus = mainEventHandlerObj.getCurrentStatus();

    const boardContainer = document.getElementsByClassName('chessBrd-area')[0];
    const movesHolder = document.getElementsByClassName('moves-details-wrapper')[0];
    
    chessElementHandlerObj.getBoardWithPieces();

        //If player have played at least one moves
        if(serverData.boardDetails.allMove.length > 0){

            chessElementHandlerObj.setBoardWithMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1]);
    
            //Checkmate
            if(gameStatus[0] || gameStatus[1]){
    
                let kingSquare;
                pieceArray = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];
                if(currentFenPosition.split(" ")[1] == 'w'){
                    kingSquare = pieceArray.find(piece => piece.pieceName === 'K')?.currentSquare;
                }
                else{
                    kingSquare = pieceArray.find(piece => piece.pieceName === 'k')?.currentSquare;
                }
                
                chessElementHandlerObj.setBoardWithCheckedSquarePieces(kingSquare);
            }
            playSoundBasedOnMove(serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1], gameStatus[0]);
        }
    
        const movesInDivs = chessElementHandlerObj.createMoveElements(serverData.boardDetails.allMove);
    
        chessElementHandlerObj.clearParentElement(movesHolder);
        chessElementHandlerObj. placeChildElementInParentElement(movesInDivs, movesHolder);
    
        let htmlBoardElement = chessElementHandlerObj.getBoardWithPieces();
    
        //Manage Hint for player
        chessElementHandlerObj.clearParentElement(boardContainer);
        chessElementHandlerObj. placeChildElementInParentElement(htmlBoardElement, boardContainer);

        if(yourTime < 1 || opponentTime < 1){

            let whiteRemainingTime = serverData.boardDetails.whiteRemainingTime;
            let blackRemainingTime = serverData.boardDetails.blackRemainingTime;

            if(whiteRemainingTime < 1){
                gameOver('b', "Black Won On Time");
            }
            else if(blackRemainingTime < 1){
                gameOver('w', "White Won On Time");
            }
            
        }
        //If time is not over and game can be continued
        else if(gamePlayable){

            //Find if it is player to move
            if(currentFenPosition.split(" ")[1] == playerColor){
    
                //Now do all the action related to board on browser Get valid move in return
                const currentPlayersAllLegalMoves = mainEventHandlerObj.getAllLegalMovesOfBothPlayers()[0];
    
                let playersMovedPieceAndSquare = findPlayersMoveAndPiece(currentPlayersAllLegalMoves, htmlBoardElement, boardContainer, chessElementHandlerObj, null);
    
                //Only Continue if player makes a valid Move
                playersMovedPieceAndSquare.then(async function(val){
    
                    //val variable will be having three items in array [movedPieceDetails, movedNumber, piecePromotion]
                    //Set updated Fen position
                    mainEventHandlerObj.setUpdatedFenPositionAndCastelPerms(val);
                    mainEventHandlerObj.setUpdatedFenPositionStatus();
                    mainEventHandlerObj.setCurrentMove(val);
    
                    const newFenPosition = mainEventHandlerObj.getUpdatedFenPosition();
                    const newCastelDetails = mainEventHandlerObj.getUpdatedCastelPerms();
                    const currentMove = mainEventHandlerObj.getCurrentMove();
    
                    //Insert this data in database
                    //____________________________________________________________
    
                    //continue game with new position with stockfish move
                    serverData.boardDetails.allMove.push(currentMove);
                    serverData.boardDetails.allfinalFenPosition.push(newFenPosition);
                    serverData.boardDetails.castelDetails = newCastelDetails;

                    clearInterval(yourTimeInterval);
                    clearInterval(opponentTime);

                        //Set your and opponent time

                    let whiteRemainingTime = currentFenPosition.split(" ")[1] == 'w' ? yourTime : opponentTime;
                    let blackRemainingTime = currentFenPosition.split(" ")[1] == 'w' ? opponentTime : yourTime;

                    serverData.boardDetails.whiteRemainingTime = whiteRemainingTime;
                    serverData.boardDetails.blackRemainingTime = blackRemainingTime;


                    const dataToRecord = {
                        "matchNumber" : serverData.gameDetails.channelNumber,
                        "startingFenPosition" : currentFenPosition,
                        "finalFenPosition" : newFenPosition,
                        "move" : currentMove,
                        "remainingTimeWhite" : whiteRemainingTime,
                        "remainingTimeBlack" : blackRemainingTime
                    };

                    callPostMethod(dataToRecord, "/recordPlayerMove", "POST");
                    callPostMethod(serverData, "/playersMadeMove", "POST");
                });
            }
       }
       //End Game Here
       else{

            clearInterval(yourTimeInterval);
            clearInterval(opponentTimeInterval);

            const lastMoveMade = serverData.boardDetails.allMove[serverData.boardDetails.allMove.length - 1];
            const winningPlayerColor = currentFenPosition.split(" ")[1] == 'w' ? 'b' : 'w';

            if(lastMoveMade.split(" ").length == 4){

                setTimeout(() => {
                    gameOver(null, "Draw");
                }, 1500);

            }
            //Game Ended in checkMate
            else if(lastMoveMade.split(" ").length == 5){
                setTimeout(() => {
                    gameOver(winningPlayerColor, "CheckMate");
                }, 1500);
            }

       }
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
                            clickedPiece = null;
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
        const mainContainer = document.getElementsByClassName('main-chess-board-moves')[0];
    
        options.style.display = 'block';
        mainContainer.className += " blure";
    
        const cross = document.getElementsByClassName('sign-cross')[0].getElementsByTagName('span')[0];
        cross.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className = "main-chess-board-moves";

            resolve(-1);
        });

        const optQueen = document.getElementsByClassName('OptQueen')[0];
        const optBishop = document.getElementsByClassName('OptBishop')[0];
        const optNight = document.getElementsByClassName('OptNight')[0];
        const optRook = document.getElementsByClassName('OptRook')[0];

        const tempFenHolder = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];
        const playerToMove = tempFenHolder.split(" ")[1];

        if(playerToMove == 'b'){
            optQueen.getElementsByTagName('img')[0].setAttribute("src", "/Images/black_pieces/q.png");
            optBishop.getElementsByTagName('img')[0].setAttribute("src", "/Images/black_pieces/b.png");
            optNight.getElementsByTagName('img')[0].setAttribute("src", "/Images/black_pieces/n.png");
            optRook.getElementsByTagName('img')[0].setAttribute("src", "/Images/black_pieces/r.png");
        }
        else{
            optQueen.getElementsByTagName('img')[0].setAttribute("src", "/Images/white_pieces/Q.png");
            optBishop.getElementsByTagName('img')[0].setAttribute("src", "/Images/white_pieces/B.png");
            optNight.getElementsByTagName('img')[0].setAttribute("src", "/Images/white_pieces/N.png");
            optRook.getElementsByTagName('img')[0].setAttribute("src", "/Images/white_pieces/R.png");
        }

        optQueen.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-chess-board-moves";

            resolve('q');
        });
        optBishop.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-chess-board-moves";

            resolve('b');

        });
        optNight.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-chess-board-moves";

            resolve('n');

        });
        optRook.addEventListener('click', () => {
            options.style.display = 'none';
            mainContainer.className += "main-chess-board-moves";

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

function initialEngineMatchSetUp(){
    //All requied details for initial setup
    const exitBtn = document.getElementsByClassName('btn-leave')[0];
    const imageTop = document.getElementsByClassName('imageTop')[0];
    const imageButtom = document.getElementsByClassName('imageButtom')[0];
    const topName = document.getElementsByClassName('topName')[0];
    const buttomName = document.getElementsByClassName('buttomName')[0];

    let topImageName;
    let buttomImageName;

    if(serverData.playerInfomation.yourId == serverData.playerInfomation.playerBlackId){
        topImageName = serverData.playerInfomation.whitePlayerImage;
        buttomImageName = serverData.playerInfomation.blackPlayerImage;

        topName.textContent = serverData.playerInfomation.playerWhiteName;
        buttomName.textContent = serverData.playerInfomation.playerBlackName;
    }
    else{
        topImageName = serverData.playerInfomation.blackPlayerImage;
        buttomImageName = serverData.playerInfomation.whitePlayerImage;

        topName.textContent = serverData.playerInfomation.playerBlackName;
        buttomName.textContent = serverData.playerInfomation.playerWhiteName;
    }
    imageTop.setAttribute('src', '/Images/Profile/' + topImageName);
    imageButtom.setAttribute('src', '/Images/Profile/' + buttomImageName);


    exitBtn.addEventListener('click', () => {

        if(serverData.gameDetails.gameType == "puzzle"){
            window.location.href = '/puzzle';
        }
        else{
            window.location.href = '/play';
        }
        
    });
}

let hintButtonInitialized = false;

function initializeHintButtonListener() {
    
    const hintButton = document.getElementsByClassName('btn-hint')[0];
    const playerColor = serverData.playerInfomation.playerBlackId == serverData.playerInfomation.yourId ? 'b' : 'w';
    const currentFenPosition = serverData.boardDetails.allfinalFenPosition.length == 0 ? serverData.boardDetails.startingFenPosition : serverData.boardDetails.allfinalFenPosition[serverData.boardDetails.allfinalFenPosition.length - 1];

    const getOrPostRequestObj = new GetOrPostRequest();
    const mainEventHandlerObj = new MainChessController(currentFenPosition, serverData.boardDetails.castelDetails);
    hintButton.addEventListener('click', async () => {
        console.log("Hint Initialized");
        if (globalFenPos.split(" ")[1] == playerColor) {
            try {
                const nodeServerUrl = 'http://localhost:3000';
                let bestMove = await getOrPostRequestObj.getBestMove(globalFenPos, parseInt(serverData.gameDetails.level) * 3 + 5, nodeServerUrl);
                bestMove = bestMove.trim();

                if (bestMove != "(none)") {
                    const currentSquareOfPiece = mainEventHandlerObj.findPieceCurrnetSquare(bestMove);
                    const movedSquareOfPiece = mainEventHandlerObj.findPieceMovedSquare(bestMove);

                    document.getElementsByClassName(currentSquareOfPiece)[0].style.backgroundColor = '#FFD700';
                    document.getElementsByClassName(currentSquareOfPiece)[0].style.border = '2px solid black';

                    document.getElementsByClassName(movedSquareOfPiece)[0].style.backgroundColor = '#FFD700';
                    document.getElementsByClassName(movedSquareOfPiece)[0].style.border = '2px solid black';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', main);