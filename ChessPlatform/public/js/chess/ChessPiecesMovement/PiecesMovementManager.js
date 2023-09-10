class PiecesMovementManager{

    constructor(chessBoardArray, piecesMoveDetectionArray, playerColor, fenPosition){

        this.chessBoardArray = chessBoardArray;
        this.piecesMoveDetectionArray = piecesMoveDetectionArray;
        this.playerColor = playerColor;
        this.fenPosition = fenPosition;
    }

    piecesMovementDetails(){

        let tempYourPiecesMoveDetection = [];
        let tempOpponentPiecesMoveDetection = [];

        for(let ranks = 1; ranks <= 8; ranks++){

            for(let files = 1; files <= 8; files++){

                const squareNumber = this.fileRankToSquare(files, ranks);
                const currentPiece = this.chessBoardArray[squareNumber - 1];

                if(currentPiece != 0){

                    const ownPiece = this.ownPieceFound(this.playerColor, currentPiece);

                    let currentPlayer = this.playerColor;
                    if(!ownPiece){
                        currentPlayer = this.playerColor == 'w' ? 'b' : 'w';
                    }

                    const availableMoves = this.availableMovesCaptures(currentPiece, squareNumber, ranks, files, currentPlayer);

                    let tempObj = {
                        pieceName : currentPiece,
                        currentSquare : squareNumber,
                        availableSquares : availableMoves[0],
                        availableCaptures : availableMoves[1],
                        unphasantSquare: availableMoves[2],
                        castelSquare: availableMoves[3]
                    };

                    if(ownPiece){
                        tempYourPiecesMoveDetection.push(tempObj);
                    }
                    else{
                        tempOpponentPiecesMoveDetection.push(tempObj);
                    }
                }
            }
        }

        return [tempYourPiecesMoveDetection, tempOpponentPiecesMoveDetection];
    }

    availableMovesCaptures(piece, squareNumber, rank, file, currentPlayer){

        let tempArr;
        let sqIdx = this.arrayIndexToSqNum(squareNumber) - 1;

        if(piece == 'p'){
            tempArr = this.blackPawnMovement(sqIdx, rank, file, currentPlayer);
        }
        else if(piece == 'P'){
            tempArr = this.whitePawnMovement(sqIdx, rank, file, currentPlayer);
        }
        else if(piece == 'r' || piece == 'R'){
            const possibleIndexChangesArray = [10, -10, 1, -1];
            tempArr = this.rookBishopQueenMovemenst(sqIdx, possibleIndexChangesArray, currentPlayer);
        }
        else if(piece == 'n' || piece == 'N'){
            const possibleIndexChangesArray = [8, 12, 19, 21, -8, -12, -19, -21];
            tempArr = this.kingNightMovements(sqIdx, possibleIndexChangesArray, currentPlayer, piece);
        }
        else if(piece == 'q' || piece == 'Q'){
            const possibleIndexChangesArray = [11, -11, 9, -9, 10, -10, 1, -1];
            tempArr = this.rookBishopQueenMovemenst(sqIdx, possibleIndexChangesArray, currentPlayer);
        }
        else if(piece == 'k' || piece == 'K'){
            const possibleIndexChangesArray = [1, -1, 10, 11, 9, -10, -9, -11];
            tempArr = this.kingNightMovements(sqIdx, possibleIndexChangesArray, currentPlayer, piece);
        }
        else {
            const possibleIndexChangesArray = [11, -11, 9, -9];
            tempArr = this.rookBishopQueenMovemenst(sqIdx, possibleIndexChangesArray, currentPlayer);
        }

        return tempArr;
    }

    blackPawnMovement(sqIdx, rank, file, currentPlayer){

        let tempMoves = [];
        let tempCaptures = [];
        let tempUnphasant = [];

        const oneHighRankSquare = this.piecesMoveDetectionArray[sqIdx - 10];
        const twoHighRankSquare = this.piecesMoveDetectionArray[sqIdx - 20];

        if(sqIdx > 80 && sqIdx < 90){
            if(oneHighRankSquare == 0 && twoHighRankSquare == 0){
                tempMoves.push(this.fileRankToSquare(file, rank - 2));
            }
        }

        if(oneHighRankSquare == 0){
            tempMoves.push(this.fileRankToSquare(file, rank - 1));
        }

        const topLeftCapture = this.piecesMoveDetectionArray[sqIdx - 11];
        const topRightCapture = this.piecesMoveDetectionArray[sqIdx - 9];

        if(this.opponentPieces(currentPlayer, topLeftCapture)){
            tempCaptures.push(this.fileRankToSquare(file - 1, rank - 1));
        }
        if(this.opponentPieces(currentPlayer, topRightCapture)){
            tempCaptures.push(this.fileRankToSquare(file + 1, rank - 1));
        }

        //Unphasant possible in black pawn if the condition below is matched
        if(this.fenPosition.split(" ")[1] == 'b' && this.fenPosition.split(" ")[3] != '-'){

            const unphasantCode = this.fenPosition.split(" ")[3];

            //converting square number to square index
            const unphasantSqIdx = this.findUnphasantSq(unphasantCode) - 1;

            if(unphasantSqIdx + 9 == sqIdx || unphasantSqIdx + 11 == sqIdx){
                
                const newRankFileArray = this.findRankFileDifference(unphasantSqIdx , 0);

                const newRank = newRankFileArray[0];
                const newFile = newRankFileArray[1];

                tempUnphasant.push(this.fileRankToSquare(newFile, newRank));
            }
        }

        return [tempMoves, tempCaptures, tempUnphasant, []];
    }

    whitePawnMovement(sqIdx, rank, file, currentPlayer){

        let tempMoves = [];
        let tempCaptures = [];
        let tempUnphasant = [];

        const oneLowRankSquare = this.piecesMoveDetectionArray[sqIdx + 10];
        const twoLowRankSquare = this.piecesMoveDetectionArray[sqIdx + 20];

        if(sqIdx > 30 && sqIdx < 40){
            if(oneLowRankSquare == 0 && twoLowRankSquare == 0){
                tempMoves.push(this.fileRankToSquare(file, rank + 2));
            }
        }

        if(oneLowRankSquare == 0){
            tempMoves.push(this.fileRankToSquare(file, rank + 1));
        }

        const downLeftCapture = this.piecesMoveDetectionArray[sqIdx + 9];
        const downRightCapture = this.piecesMoveDetectionArray[sqIdx + 11];

        if(this.opponentPieces(currentPlayer, downLeftCapture)){
            tempCaptures.push(this.fileRankToSquare(file - 1, rank + 1));
        }
        if(this.opponentPieces(currentPlayer, downRightCapture)){
            tempCaptures.push(this.fileRankToSquare(file + 1, rank + 1));
        }

        //Unphasant possible in black pawn if the condition below is matched
        if(this.fenPosition.split(" ")[1] == 'w' && this.fenPosition.split(" ")[3] != '-'){

            const unphasantCode = this.fenPosition.split(" ")[3];

            //converting square number to square index
            const unphasantSqIdx = this.findUnphasantSq(unphasantCode) - 1;

            if(unphasantSqIdx - 9 == sqIdx || unphasantSqIdx - 11 == sqIdx){
                
                const newRankFileArray = this.findRankFileDifference(unphasantSqIdx , 0);

                const newRank = newRankFileArray[0];
                const newFile = newRankFileArray[1];

                tempUnphasant.push(this.fileRankToSquare(newFile, newRank));
            }
        }

        return [tempMoves, tempCaptures, tempUnphasant, []];
    }

    rookBishopQueenMovemenst(sqIdx, possibleIndexChangesArray, currentPlayer){

        let tempMoves = [];
        let tempCaptures = [];

        const possibleMovingIdxArray = possibleIndexChangesArray;

        for(let i = 0; i < possibleMovingIdxArray.length; i++){

            let tempSqIdx = sqIdx;
            let keepIteration = true;
            let counter = 1;

            while(keepIteration){

                const newRankFileArray = this.findRankFileDifference(sqIdx, possibleMovingIdxArray[i] * counter);

                const newRank = newRankFileArray[0];
                const newFile = newRankFileArray[1];

                tempSqIdx += possibleMovingIdxArray[i];
                const pieceInTargetSquare = this.piecesMoveDetectionArray[tempSqIdx];

                if(pieceInTargetSquare == 0){
                    tempMoves.push(this.fileRankToSquare(newFile, newRank));
                }
                else if(pieceInTargetSquare == 1){
                    keepIteration = false;
                }
                else if(this.opponentPieces(currentPlayer, pieceInTargetSquare)){
                    tempCaptures.push(this.fileRankToSquare(newFile, newRank));
                    keepIteration = false;
                }
                else{
                    keepIteration = false;
                }
                counter++;
            }
        }

        return [tempMoves, tempCaptures, [], []];
    }

    kingNightMovements(sqIdx, possibleIndexChangesArray, currentPlayer, piece){

        let tempMoves = [];
        let tempCaptures = [];
        let tempCastels = [];

        const possibleMovingIdxArray = possibleIndexChangesArray;

        for(let i = 0; i < possibleMovingIdxArray.length; i++){

            const pieceInTargetSquare = this.piecesMoveDetectionArray[sqIdx + possibleMovingIdxArray[i]];

            if(pieceInTargetSquare != 1){

                const newRankFileArray = this.findRankFileDifference(sqIdx, possibleMovingIdxArray[i]);

                const newRank = newRankFileArray[0];
                const newFile = newRankFileArray[1];

                if(pieceInTargetSquare == 0){
                    tempMoves.push(this.fileRankToSquare(newFile, newRank));
                }
                else if(this.opponentPieces(currentPlayer, pieceInTargetSquare)){
                    tempCaptures.push(this.fileRankToSquare(newFile, newRank));
                }
            }
        }

        if(piece == 'K' || piece == 'k'){

            const castelRight = this.fenPosition.split(" ")[2].split("");

            if(currentPlayer == 'w'){

                if(castelRight.includes('K') && this.piecesMoveDetectionArray[sqIdx + 1] == 0 && this.piecesMoveDetectionArray[sqIdx + 2] == 0){
                    const newRankFileArray = this.findRankFileDifference(sqIdx, 2);

                    const newRank = newRankFileArray[0];
                    const newFile = newRankFileArray[1];

                    tempCastels.push(this.fileRankToSquare(newFile, newRank));
                }
                if(castelRight.includes('Q') && this.piecesMoveDetectionArray[sqIdx - 1] == 0 && this.piecesMoveDetectionArray[sqIdx - 2] == 0 && this.piecesMoveDetectionArray[sqIdx - 3] == 0){
                    const newRankFileArray = this.findRankFileDifference(sqIdx, -2);

                    const newRank = newRankFileArray[0];
                    const newFile = newRankFileArray[1];

                    tempCastels.push(this.fileRankToSquare(newFile, newRank));
                }
            }
            else{
                if(castelRight.includes('k') && this.piecesMoveDetectionArray[sqIdx + 1] == 0 && this.piecesMoveDetectionArray[sqIdx + 2] == 0){
                    const newRankFileArray = this.findRankFileDifference(sqIdx, 2);

                    const newRank = newRankFileArray[0];
                    const newFile = newRankFileArray[1];

                    tempCastels.push(this.fileRankToSquare(newFile, newRank));
                }
                if(castelRight.includes('q') && this.piecesMoveDetectionArray[sqIdx - 1] == 0 && this.piecesMoveDetectionArray[sqIdx - 2] == 0 && this.piecesMoveDetectionArray[sqIdx - 3] == 0){
                    const newRankFileArray = this.findRankFileDifference(sqIdx, -2);

                    const newRank = newRankFileArray[0];
                    const newFile = newRankFileArray[1];

                    tempCastels.push(this.fileRankToSquare(newFile, newRank));
                }

            }
        }

        return [tempMoves, tempCaptures, [], tempCastels];
    }

    opponentPieces(color, piece){
        if(color == "b"){
            if(piece == 'r' || piece == 'n' || piece == 'b' || piece == 'q' || piece == 'k' || piece == 'p'){
                return false;
            }
            else if(piece == 0 || piece == 1){
                return false;
            }
            else{
                return true;
            }
        }
        else{
            if(piece == 'r' || piece == 'n' || piece == 'b' || piece == 'q' || piece == 'k' || piece == 'p'){
                return true;
            }
            else if(piece == 0 || piece == 1){
                return false;
            }
            else{
                return false;
            }
        }
    }

    ownPieceFound(playerColor, piece){

        if(playerColor == 'w'){
            if(piece == 'R' || piece == 'N' || piece == 'B' || piece == 'Q' || piece == 'K' || piece == 'P'){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            if(piece == 'r' || piece == 'n' || piece == 'b' || piece == 'q' || piece == 'k' || piece == 'p'){
                return true;
            }
            else{
                return false;
            }
        }
    }

    fileRankToSquare(file, rank){
        
        const totalSq = rank * 8;
        const extraSq = 8 - file;

        return totalSq - extraSq;
    }

    findRankFileDifference(pieceSquare, addedIndex){

        const currentSquare = pieceSquare + addedIndex + 1;

        const rank = ((currentSquare - currentSquare % 10)/10 + 1);
        const file = 10 - ((rank * 10) - currentSquare);

        return [rank - 2, file - 1];
    }

    arrayIndexToSqNum(num){

        let tempChar;
    
        if(num >= 1 && num <= 8){
            tempChar = 0;
        }
        else if(num >= 9 && num <= 16){
            tempChar = 2;
        }
        else if(num >= 17 && num <= 24){
            tempChar = 4;
        }
        else if(num >= 25 && num <= 32){
            tempChar = 6;
        }
        else if(num >= 33 && num <= 40){
            tempChar = 8;
        }
        else if(num >= 41 && num <= 48){
            tempChar = 10;
        }
        else if(num >= 49 && num <= 56){
            tempChar = 12;
        }
        else if(num >= 57 && num <= 64){
            tempChar = 14;
        }
    
        return (21 + num + tempChar);
    }

    showArraysInConsole(){
        let counter = 1;
        let tempChars = "";
        for(let i = 0; i < this.piecesMoveDetectionArray.length; i++){

            tempChars += this.piecesMoveDetectionArray[i] + " ";

            if(counter == 10){
                console.log("_________________________________");
                console.log(tempChars);
                counter = 0;

                tempChars = "";
            }

            counter++;
        }
    }

    findUnphasantSq(unphasantCode){

        const fileChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const squareNum = this.fileRankToSquare(fileChars.indexOf(unphasantCode[0]) + 1, unphasantCode[1]);

        return this.arrayIndexToSqNum(squareNum);
    }
}