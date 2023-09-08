function main(){
  const initialFenPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
  boardSetup(initialFenPos, 'w', null);

  puzzleSubmitted();
}

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

function puzzleSubmitted(){
    const checkFenPosBtn = document.getElementsByClassName('checkfen')[0];

    const inputFenPos = document.getElementsByClassName('fenPosPuzzle')[0];
    const numberOfMoves = document.getElementById('numberOfMoves');
    const puzzleCategory = document.getElementById('category');

    checkFenPosBtn.addEventListener('click', async () => {

        const fenPos = inputFenPos.value;
        const moves = numberOfMoves.value;
        const category = puzzleCategory.value;

        const validPos = checkFenPositionValidation(fenPos);

        if(validPos){
            console.log("Position is valid");
            boardSetup(fenPos, fenPos.split(" ")[1], null);

            const boolVal = await checkmateChecker(fenPos, moves, category);

            if(category == "BestMove" && boolVal){

              console.log("Fen Position has " + category + " for " + moves);
            }
            else if(category == "Checkmate" && boolVal){

              console.log("Fen Position has " + category + " in " + moves);
            }
        }
        else{
        }
    });
}


async function checkmateChecker(startingFenPosition, numberOfMoves, category){

  // const depth = numberOfMoves * 2;

  let fenPosition = startingFenPosition;
  let depth = numberOfMoves * 3;
  let bestMove;
  let playerToPlay = fenPosition.split(" ")[1];

  let playerMoveCounter = 0;
  
  if(category == "Checkmate"){

    let checkMatedBy;

    for(let i = 0; i < numberOfMoves * 2; i++){

      bestMove = await fetchBestMove(fenPosition, depth);

      //If position is checkmated break loop
      if(bestMove.trim() == "(none)"){
        checkMatedBy = fenPosition.split(" ")[1] == 'w' ? 'b' : 'w';
        break;
      }

      //If position is not checkmated and intended player have created move
      if(fenPosition.split(" ")[1] == playerToPlay && bestMove.trim() != "(none)" ){
        playerMoveCounter++;
      }

      //Lets Just look at the move and position
      console.log('____________________________________');
      console.log(fenPosition);
      console.log(bestMove);
      console.log('____________________________________');

      
      //Update fen position with new fen position
      fenPosition = gameStarterWithFenPos(fenPosition, bestMove);
    }

    if(checkMatedBy == playerToPlay && numberOfMoves == playerMoveCounter){
      console.log("Checkmated in " + playerMoveCounter + " by " + playerToPlay);
    }


    return false;
  }




  // else if(category = "BestMove"){

  // }

  // for(let i = 0; i <= numberOfMoves; i++){

  //   //check if checkmate or not
  //   //find best move
  //   console.log(fenPosition);

  //   bestMove = await fetchBestMove(fenPosition, depth);

  //   console.log(bestMove);

    
  //   //If the situation is mate
  //   if(bestMove.trim() === "(none)"){


  //     if(category == "Checkmate"){



  //       console.log(i, numberOfMoves);
  //       //checkmate found exactly at final move
  //       if(i == numberOfMoves){
  //         return true;
  //       }
  //       return false;
  //     }
  //     else if(category == "BestMove"){
  //       return false;
  //     }
  //   }
  //   else{

  //     //Get new fenPosition by moving to best move
  //     fenPosition = gameStarterWithFenPos(fenPosition, bestMove);

  //     if(category == "Checkmate" && i == numberOfMoves){

  //       //Getting best move even at last fen pos which means checkmate not possible at the last move
  //       return false;
        
  //     }
  //     //Getting best move even at last fen pos which means bestmove is possible at the given number of moves
  //     else if(category == "BestMove" && i == numberOfMoves){

  //       return true;
  //     }
  //   }
  // }

  // //category of bestmove true
  // return true;

}

async function returnOnlyBestMove(fenPosition, depth){

  let temp = await fetchBestMove(fenPosition, depth);

  bestMove.then((bestMove) => {

    return bestMove;
  }).catch((error) => {
    // Handle errors here
    console.error('Error:', error);
  });;
}



function gameStarterWithFenPos(fenPos, bestMove){

  const currentPlayerToMove = fenPos.split(" ")[1];
  const chessBoardArrayFillerObj = new ChessBoardArrayFiller(fenPos);

  const chessBoardArray = chessBoardArrayFillerObj.fillChessBoardArray();
  const piecesMoveDetectionArray = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(chessBoardArray);

  const gameStatusCheckerObj = new GameStatusChecker();

  const castelDetails = returnCastelDetails(fenPos);



  const filterMovesObj = new FilterMoves(gameStatusCheckerObj, currentPlayerToMove, chessBoardArray, piecesMoveDetectionArray, fenPos, castelDetails);

  const legalMovesCaptures = filterMovesObj.filteredMoves();


  const movedSquare = findMovedSquare(bestMove);
  const currentSquare = findCurrnetSquare(bestMove);

  const clickedPieceDetails = findClickedPieceDetails(findCurrnetSquare(bestMove), legalMovesCaptures[0]);
  const piecePromo = findPiecePromo(bestMove, fenPos);
  const updatedFenPositionGeneratorObj = new UpdatedFenPositionGenerator(chessBoardArray, movedSquare, clickedPieceDetails, fenPos, castelDetails, piecePromo);
  const updatedFenPosition = updatedFenPositionGeneratorObj.returnUpdatedFenPosition();

  return updatedFenPosition;
}

function findPiecePromo(bestMove, fenPos){

  const piecesPromotedTo = ['Q', 'R', 'B', 'N', 'q', 'r', 'b', 'n'];

  const player = fenPos.split(" ")[1];
  const moveSplitted = bestMove.split("");

  if(player == 'b' && moveSplitted.length >= 5 && piecesPromotedTo.includes(moveSplitted[4])){
    return moveSplitted[4];
  }
  else if(player == 'w' && moveSplitted.length >= 5 && piecesPromotedTo.includes(moveSplitted[4])){

    return moveSplitted[4].toUpperCase();
  }


  return null;
}

function findMovedSquare(bestMove){

  const firstSq = bestMove.split('');
  return fileRankToSquare(firstSq[2], firstSq[3]);
}

function findCurrnetSquare(bestMove){

  const firstSq = bestMove.split('');
  return fileRankToSquare(firstSq[0], firstSq[1]);
}

function fileRankToSquare(file, rank){

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
        
  const totalSq = parseInt(rank) * 8;
  const extraSq = 8 - (files.indexOf(file) + 1);

  return totalSq - extraSq;
}

function findClickedPieceDetails(currentSq, yourLegalMoves){

  for(let i = 0; i < yourLegalMoves.length; i++){
    if(yourLegalMoves[i].currentSquare == currentSq){
      return yourLegalMoves[i];
    }
  }

  return -1;
}

function returnCastelDetails(fenPos){

  const castelDetails = {

    whiteKingMoved: true,

    whiteKingChecked: true,
    whiteKingSideRookMoved: true,
    whiteKingSideRookCaptured: true,

    whiteKingSideSquaresChecked: true,

    whiteQueenSideRookMoved: true,
    whiteQueenSideRookCaptured: true,
    whiteQueenSideSquaresChecked: true,

    blackKingMoved: true,
    blackKingChecked: true,
    blackKingSideRookMoved: true,
    blackKingSideRookCaptured: true,

    blackKingSideSquaresChecked: true,
    blackQueenSideRookMoved: true,
    blackQueenSideRookCaptured: true,
    blackQueenSideSquaresChecked: true,
  };
  
  const castelPerms = fenPos.split(" ")[2].split("");

  for(let i = 0; i < castelPerms.length; i++){

    if(castelPerms[i] == 'K'){
      castelDetails.whiteKingMoved = false;
      castelDetails.whiteKingChecked = false;
      castelDetails.whiteKingSideRookMoved = false;
      castelDetails.whiteKingSideRookCaptured = false;
      castelDetails.whiteKingSideSquaresChecked = false;
    }
    else if(castelPerms[i] == 'Q'){
      castelDetails.whiteKingMoved = false;
      castelDetails.whiteKingChecked = false;
      castelDetails.whiteQueenSideRookMoved = false;
      castelDetails.whiteQueenSideRookCaptured = false;
      castelDetails.whiteQueenSideSquaresChecked = false;
    }
    else if(castelPerms[i] == 'k'){
      castelDetails.blackKingMoved = false;
      castelDetails.blackKingChecked = false;
      castelDetails.blackKingSideRookMoved = false;
      castelDetails.blackKingSideRookCaptured = false;
      castelDetails.blackKingSideSquaresChecked = false;
    }
    else if(castelPerms[i] == 'q'){
      castelDetails.blackKingMoved = false;
      castelDetails.blackKingChecked = false;
      castelDetails.blackQueenSideRookMoved = false;
      castelDetails.blackQueenSideRookCaptured = false;
      castelDetails.blackQueenSideSquaresChecked = false;
    }
  }
  
  return castelDetails;
}

function pushValidPuzzlesToDB(){
  console.log("Valid puzzle recorded");
}

  
function checkFenPositionValidation(fenPos) {

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const pieceArray = 'rnbqkpRNBQKP';
    const castlingPerms = 'KQkq-';
  
    const fenArray = fenPos.split(" ");
    const eachRankPieces = fenArray[0].split("/");
  
    // Ensure all six parts are present
    if (fenArray.length !== 6) {
      return false;
    }
  
    // If file data is missing
    if (eachRankPieces.length !== 8) {
      return false;
    }
  
    for (let i = 0; i < eachRankPieces.length; i++) {
      const eachPiecesInRank = eachRankPieces[i].split("");
      let pieceCounter = 0;
  
      for (let j = 0; j < eachPiecesInRank.length; j++) {
        const char = eachPiecesInRank[j];
  
        if (pieceArray.includes(char)) {
          pieceCounter++;
        } else if (parseInt(char) >= 1 && parseInt(char) <= 8) {
          pieceCounter += parseInt(char);
        } else {
          return false;
        }
      }
  
      if (pieceCounter !== 8) {
        return false;
      }
    }
  
    if (!['w', 'b'].includes(fenArray[1])) {
      return false;
    }
  
    for (let i = 0; i < fenArray[2].length; i++) {
      if (!castlingPerms.includes(fenArray[2][i])) {
        return false;
      }
    }

    const unphasant = fenArray[3].split("");

    if(unphasant.length > 2){
        return false;
    }

    if(unphasant.length == 1 && unphasant[0] == '-'){
    }
    else if((files.includes(unphasant[0]) && ranks.includes(unphasant[1]))){
    }
    else{

        return false;
    }
  
    return true;
  }


  //Get best move
const nodeServerUrl = 'http://localhost:3000';
async function fetchBestMove(fenPosition, depthNum) {
  try {

      // Make a POST request to the Node.js route
      const response = await fetch(`${nodeServerUrl}/stockfish-api/get-best-move`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({ fen: fenPosition, depth: depthNum }), // Include depth in the request body
      });

      if (!response.ok) {
          throw new Error('Failed to fetch best move');
      }

      const data = await response.json();
      const bestMove = data.best_move;
      return bestMove; // Return the best move
  } catch (error) {
      console.error('Error:', error);
      return -1; // Handle the error gracefully and return null or another appropriate value
  }
}
  

document.addEventListener('DOMContentLoaded', main);