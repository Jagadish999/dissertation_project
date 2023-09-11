class MainChessController{
    constructor(startingFenPosition, castelDetails) {

        this.startingFenPosition = startingFenPosition;
        this.castelDetails = castelDetails;
        this.chessBoardArrayFillerObj = new ChessBoardArrayFiller(startingFenPosition);
        this.gameStatusCheckerObj = new GameStatusChecker();
        this.currentPlayerToMove = startingFenPosition.split(" ")[1];
        this.chessBoardArray = this.chessBoardArrayFillerObj.fillChessBoardArray();
        this.piecesMoveDetectionArray = this.chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(this.chessBoardArray);

        this.filterMovesObj = new FilterMoves(
            this.gameStatusCheckerObj,
            this.currentPlayerToMove,
            this.chessBoardArray,
            this.piecesMoveDetectionArray,
            this.startingFenPosition,
            this.castelDetails
        );
        this.allLegalMoves = this.filterMovesObj.filteredMoves();
        this.currentStatus = this.gameStatusChecker();
        
        this.updatedFenPosition;
        this.currentMovePlayed;
        this.updatedCastelDetails;

        this.updatedFenPositionStatus;
    }

    //This function returns true or false based on current fen Position
    //It requires ChessBoardArrayFiller, gameStatusCheckerObj, FilterMoves
    evaluateFenPosition(){
        
        if(!this.currentStatus[1] && !this.currentStatus[2]){
            return true;
        }

        return false;
    }

    //returns array of length of three: check, checkmate or stalemate
    gameStatusChecker(){

        const check = this.gameStatusCheckerObj.findCheck(this.currentPlayerToMove, this.allLegalMoves[0], this.allLegalMoves[1]);
        const checkmate = this.gameStatusCheckerObj.findCheckmate(this.allLegalMoves[0], check);
        const stalemate = this.gameStatusCheckerObj.findStalemate(this.startingFenPosition, this.allLegalMoves[0], check, this.allLegalMoves[1]);

        return [check, checkmate, stalemate];
    }

    getCurrentStatus(){

        return this.currentStatus;
    }

    //Receive all the legal moves of current player according to fenPosition in index 0 and opponent player in index 1
    getAllLegalMovesOfBothPlayers(){

        return this.allLegalMoves;
    }

    setUpdatedFenPositionAndCastelPerms(moveDetails){

        const movedPieceDetail = moveDetails[0];
        const movedSquare = moveDetails[1];
        const pawnPromotion = moveDetails[2];

        const updatedFenPositionGeneratorObj = new UpdatedFenPositionGenerator(this.chessBoardArray, movedSquare, movedPieceDetail, this.startingFenPosition, this.castelDetails, pawnPromotion);

        this.updatedFenPosition = updatedFenPositionGeneratorObj.returnUpdatedFenPosition();
        this.updatedCastelDetails = updatedFenPositionGeneratorObj.returnUpdatedCastelInfos();
    }

    getUpdatedFenPosition(){

        return this.updatedFenPosition;
    }

    getUpdatedCastelPerms(){

        return this.updatedCastelDetails;
    }

    setUpdatedFenPositionStatus(){

        const updatedFenPosition = this.updatedFenPosition;
        const castelDetails = this.updatedCastelDetails;

        const chessBoardArrayFillerObj = new ChessBoardArrayFiller(updatedFenPosition);
        const gameStatusCheckerObj = new GameStatusChecker();

        const currentPlayerToMove = updatedFenPosition.split(" ")[1];
        const chessBoardArray = chessBoardArrayFillerObj.fillChessBoardArray();
        const piecesMoveDetectionArray = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(chessBoardArray);

        const filterMovesObj = new FilterMoves(
            gameStatusCheckerObj,
            currentPlayerToMove,
            chessBoardArray,
            piecesMoveDetectionArray,
            updatedFenPosition,
            castelDetails
        );

        const allLegalMoves = filterMovesObj.filteredMoves();

        const check = gameStatusCheckerObj.findCheck(currentPlayerToMove, allLegalMoves[0], allLegalMoves[1]);
        const checkmate = gameStatusCheckerObj.findCheckmate(allLegalMoves[0], check);
        const stalemate = gameStatusCheckerObj.findStalemate(updatedFenPosition, allLegalMoves[0], check, allLegalMoves[1]);

        this.updatedFenPositionStatus = [check, checkmate, stalemate];

        return [check, checkmate, stalemate];
    }

    getUpdatedFenPositionStatus(){
        return this.updatedFenPositionStatus;
    }

    setCurrentMove(moveDetails){

        const movedPieceDetail = moveDetails[0];
        const movedSquare = moveDetails[1];

        const checkmate = this.updatedFenPositionStatus[1];
        const stalemate = this.updatedFenPositionStatus[2];

        let tempMove;

        //Normal Move
        if(movedPieceDetail.availableSquares.includes(movedSquare)){
            tempMove = movedPieceDetail.pieceName + " " + movedPieceDetail.currentSquare + " " + movedSquare;
        }
        //Move with capture
        else if(movedPieceDetail.availableCaptures.includes(movedSquare) || movedPieceDetail.unphasantSquare.includes(movedSquare)){
            tempMove = movedPieceDetail.pieceName + "x " + movedPieceDetail.currentSquare + " " + movedSquare;
        }
        //move of king in castel
        else if(movedPieceDetail.castelSquare.includes(movedSquare)){
            tempMove = movedPieceDetail.pieceName + "c " + movedPieceDetail.currentSquare + " " + movedSquare;
        }

        //If checkmate
        if(checkmate){

            const playerWinning = this.startingFenPosition.split(" ")[1];
            tempMove += " " + playerWinning + " W";
        }
        else if(stalemate){
            tempMove += " D";
        }

        this.currentMovePlayed = tempMove;
    }

    getCurrentMove(){
        return this.currentMovePlayed;
    }

    //set current piece detail
    findPieceMovedSquare(bestMove){
        const firstSq = bestMove.split('');
        return this.fileRankToSquare(firstSq[2], firstSq[3]);
    }

    findPieceCurrnetSquare(bestMove){

        const firstSq = bestMove.split('');
        return this.fileRankToSquare(firstSq[0], firstSq[1]);
      }

    findSelectedPieceDetails(pieceSquare){

        for(let i = 0; i < this.allLegalMoves[0].length; i++){
            if(this.allLegalMoves[0][i].currentSquare == pieceSquare){
              return this.allLegalMoves[0][i];
            }
          }
    }

    fileRankToSquare(file, rank){

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      
        const totalSq = parseInt(rank) * 8;
        const extraSq = 8 - (files.indexOf(file) + 1);
      
        return totalSq - extraSq;
      }

    findPawnPromotionIfExist(bestMove){

        const piecesPromotedTo = ['q', 'r', 'b', 'n'];
        const player = this.startingFenPosition.split(" ")[1];
        const moveSplitted = bestMove.split("");

        if(player == 'b' && piecesPromotedTo.includes(moveSplitted[4])){
            return moveSplitted[4];
        }
        else if(player == 'w' && piecesPromotedTo.includes(moveSplitted[4])){
            return moveSplitted[4].toUpperCase();
        }
        else{
            return null;
        }
    }
}