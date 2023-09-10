class FilterMoves{

    constructor(gameStatusCheckerObj, playerColor, chessBoardArray, piecesMoveDetectionArray, fenPosition, castelDetails){

        this.gameStatusCheckerObj = gameStatusCheckerObj;
        this.playerColor = playerColor;
        this.chessBoardArray = chessBoardArray;
        this.piecesMoveDetectionArray = piecesMoveDetectionArray;
        this.fenPosition = fenPosition;
        this.castelDetails = castelDetails;
    }

    filteredMoves(){

        const piecesMovementManagerObj = new PiecesMovementManager(this.chessBoardArray, this.piecesMoveDetectionArray, this.playerColor, this.fenPosition);

        const allMoves = piecesMovementManagerObj.piecesMovementDetails();

        const tempYourMoves = allMoves[0];
        const tempOpponentMoves = allMoves[1];

        for(let allPieces = 0; allPieces < tempYourMoves.length; allPieces++){

            let tempAvailableSquare = tempYourMoves[allPieces].availableSquares.slice();
            let tempCaptureSquare = tempYourMoves[allPieces].availableCaptures.slice();
            let tempUnphasantSquare = tempYourMoves[allPieces].unphasantSquare.slice();

            for(let capture = 0; capture < tempYourMoves[allPieces].availableCaptures.length; capture++){

                //copy of all the required properties for UpdatedFenPositionGenerator class
                const brd = this.chessBoardArray.slice();
                const movedSquare = parseInt(tempYourMoves[allPieces].availableCaptures[capture]);
                const clickedPieceDetail = { ...tempYourMoves[allPieces] };
                const fen = this.fenPosition.slice();
                const castels = { ...this.castelDetails };

                const tempFenPosUpdaterObj = new UpdatedFenPositionGenerator(brd, movedSquare, clickedPieceDetail, fen, castels);
                let tempFenPos = tempFenPosUpdaterObj.returnUpdatedFenPosition();

                //create new temp fen position
                tempFenPos = tempFenPos.split(" ");
                tempFenPos[1] = this.playerColor;
                tempFenPos = tempFenPos.join(" ");

                if(this.checkLegalMoves(tempFenPos)){

                    // tempAvailableSquare.pop(movedSquare);
                    const idx = tempCaptureSquare.indexOf(movedSquare);
                    if(idx > -1){
                        tempCaptureSquare.splice(idx, 1);
                    }
                }

                //assign new tempMoves 
                if(capture == tempYourMoves[allPieces].availableCaptures.length - 1){

                    tempYourMoves[allPieces].availableCaptures = tempCaptureSquare;
                }

            }
            for(let move = 0; move < tempYourMoves[allPieces].availableSquares.length; move++){

                //copy of all the required properties for UpdatedFenPositionGenerator class
                const brd = this.chessBoardArray.slice();
                const movedSquare = parseInt(tempYourMoves[allPieces].availableSquares[move]);
                const clickedPieceDetail = { ...tempYourMoves[allPieces] };
                const fen = this.fenPosition.slice();
                const castels = { ...this.castelDetails };

                const tempFenPosUpdaterObj = new UpdatedFenPositionGenerator(brd, movedSquare, clickedPieceDetail, fen, castels);
                let tempFenPos = tempFenPosUpdaterObj.returnUpdatedFenPosition();

                //create new temp fen position
                tempFenPos = tempFenPos.split(" ");
                tempFenPos[1] = this.playerColor;
                tempFenPos = tempFenPos.join(" ");

                //check if the move is legal or not
                if(this.checkLegalMoves(tempFenPos)){

                    // tempAvailableSquare.pop(movedSquare);
                    const idx = tempAvailableSquare.indexOf(movedSquare);
                    if(idx > -1){
                        tempAvailableSquare.splice(idx, 1);
                    }
                }

                //assign new tempMoves 
                if(move == tempYourMoves[allPieces].availableSquares.length - 1){

                    tempYourMoves[allPieces].availableSquares = tempAvailableSquare;
                }
            }

            for(let unphasant = 0; unphasant < tempYourMoves[allPieces].unphasantSquare.length; unphasant++){
                //copy of all the required properties for UpdatedFenPositionGenerator class
            // let tempUnphasantSquare = tempYourMoves[allPieces].unphasantSquare.slice();
                const brd = this.chessBoardArray.slice();
                const movedSquare = parseInt(tempYourMoves[allPieces].unphasantSquare[unphasant]);
                const clickedPieceDetail = { ...tempYourMoves[allPieces] };
                const fen = this.fenPosition.slice();
                const castels = { ...this.castelDetails };

                const tempFenPosUpdaterObj = new UpdatedFenPositionGenerator(brd, movedSquare, clickedPieceDetail, fen, castels);
                let tempFenPos = tempFenPosUpdaterObj.returnUpdatedFenPosition();

                //create new temp fen position
                tempFenPos = tempFenPos.split(" ");
                tempFenPos[1] = this.playerColor;
                tempFenPos = tempFenPos.join(" ");

                //check if the move is legal or not
                if(this.checkLegalMoves(tempFenPos)){

                    const idx = tempUnphasantSquare.indexOf(movedSquare);
                    if(idx > -1){
                        tempUnphasantSquare.splice(idx, 1);
                    }
                }

                //assign new tempMoves 
                if(unphasant == tempYourMoves[allPieces].unphasantSquare.length - 1){

                    tempYourMoves[allPieces].unphasantSquare = tempUnphasantSquare;
                }
            }
        }

        return [tempYourMoves, tempOpponentMoves];
    }

    checkLegalMoves(newFenPosition){


        const chessBoardArrayFillerObj = new ChessBoardArrayFiller(newFenPosition);

        const brd = chessBoardArrayFillerObj.fillChessBoardArray();
        const move = chessBoardArrayFillerObj.fillPiecesMoveDetectionArray(brd);

        const piecesMovementManagerObj = new PiecesMovementManager(brd, move, this.playerColor, newFenPosition);

        const allMoves = piecesMovementManagerObj.piecesMovementDetails();

        const tempYourMoves = allMoves[0];
        const tempOpponentMoves = allMoves[1];

        const checker = new GameStatusChecker();


        return checker.findCheck(this.playerColor, tempYourMoves, tempOpponentMoves);
    }

}