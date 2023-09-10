class UpdatedFenPositionGenerator{

    constructor(chessBoardArray, movedSquare, clickedPieceDetail, fenPosition, castelDetails, pawnPromotedTo){

        this.chessBoardArray = chessBoardArray;
        this.movedSquare = movedSquare;
        this.clickedPieceDetail = clickedPieceDetail;
        this.fenPosition = fenPosition;
        this.castelDetails = castelDetails;
        this.pawnPromotedTo = pawnPromotedTo;
    }

    returnUpdatedFenPosition(){

        let tempChessBoardArray = this.chessBoardArray;
        const pieceName = this.clickedPieceDetail.pieceName;

        if(pieceName == 'k' || pieceName == 'K' || pieceName == 'p' || pieceName == 'P'){

            if(pieceName == 'k' && this.clickedPieceDetail.castelSquare.includes(this.movedSquare)){

                if(this.clickedPieceDetail.currentSquare > this.movedSquare){
                    //castel king side
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare -1] = 'k';
                    tempChessBoardArray[56] = 0;
                    tempChessBoardArray[this.movedSquare] = 'r';
                }
                else{
                    //casteled king side
                    console.log(this.chessBoardArray[this.clickedPieceDetail.currentSquare - 1]);
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare - 1] = 'k';
                    tempChessBoardArray[63] = 0;
                    tempChessBoardArray[this.movedSquare - 2] = 'r';
                }
            }
            else if(pieceName == 'K' && this.clickedPieceDetail.castelSquare.includes(this.movedSquare)){

                if(this.clickedPieceDetail.currentSquare > this.movedSquare){
                    //casteled queen side
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare -1] = 'K';
                    tempChessBoardArray[0] = 0;
                    tempChessBoardArray[this.movedSquare] = 'R';
                }
                else{
                    //castel king side
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare -1] = 'K';
                    tempChessBoardArray[7] = 0;
                    tempChessBoardArray[this.movedSquare -2] = 'R';
                }

            }
            else if(pieceName == 'p' && this.clickedPieceDetail.unphasantSquare.includes(this.movedSquare)){
                tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                tempChessBoardArray[this.movedSquare - 1] = 'p';
                tempChessBoardArray[(this.movedSquare - 1) + 8] = 0;

            }
            else if(pieceName == 'P' && this.clickedPieceDetail.unphasantSquare.includes(this.movedSquare)){
                tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                tempChessBoardArray[this.movedSquare - 1] = 'P';
                tempChessBoardArray[(this.movedSquare - 1) - 8] = 0;

            }
            else if(pieceName == 'P' && (this.movedSquare >= 57 && this.movedSquare <= 64)){
                if(this.pawnPromotedTo != null){
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare - 1] = this.pawnPromotedTo;
                }
                else{
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare - 1] = 'Q';
                }
            }
            else if(pieceName == 'p' && (this.movedSquare >= 1 && this.movedSquare <= 8)){
                if(this.pawnPromotedTo != null){
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare - 1] = this.pawnPromotedTo;
                }
                else{
                    tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                    tempChessBoardArray[this.movedSquare - 1] = 'q';
                }
            }
            else{
                
                tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
                tempChessBoardArray[this.movedSquare - 1] = this.clickedPieceDetail.pieceName;
            }
        }
        else{
            tempChessBoardArray[this.clickedPieceDetail.currentSquare - 1] = 0;
            tempChessBoardArray[this.movedSquare - 1] = this.clickedPieceDetail.pieceName;
        }

        const piecesPlacementPos = this.getPiecesPlacemnetPosition(tempChessBoardArray);

        const nextPlayer = this.getNextPlayer();

        this.updateCastelPermissionDetalis(piecesPlacementPos);
        const castelRigth = this.castelRigths();

        const unphasantsq = this.getUnphasantsq(piecesPlacementPos);
        const moveForDraw = this.moveForDraw();
        const totalMoves = this.fenPosition.split(" ")[1] == 'b' ? parseInt(this.fenPosition.split(" ")[5]) + 1 : this.fenPosition.split(" ")[5];

        return piecesPlacementPos + " " + nextPlayer + " " + castelRigth + " " + unphasantsq + " " + moveForDraw + " " + totalMoves;
    }

    updateCastelPermissionDetalis(newPiecesPlacements){

        const pieceName = this.clickedPieceDetail.pieceName;

        //if black king is moved
        if(pieceName == 'K'){
            this.castelDetails.whiteKingMoved = true;
        }
        //if white king is moved
        else if(pieceName == 'k'){
            this.castelDetails.blackKingMoved = true;
        }
        //if white rook is moved
        else if(pieceName == 'R'){
            if(this.clickedPieceDetail.currentSquare == 8){
                this.castelDetails.whiteKingSideRookMoved = true;
            }
            else if(this.clickedPieceDetail.currentSquare == 1){
                this.castelDetails.whiteQueenSideRookMoved = true;
            }
        }
        //if black rook is moved
        else if(pieceName == 'r'){
            if(this.clickedPieceDetail.currentSquare == 57){
                this.castelDetails.blackQueenSideRookMoved = true;
            }
            else if(this.clickedPieceDetail.currentSquare == 64){
                this.castelDetails.blackKingSideRookMoved = true;
            }
        }
        //if white king side rook is captured
        if(this.movedSquare == 8 && this.chessBoardArray[7] != 'R'){
            this.castelDetails.whiteKingSideRookCaptured = true;
        }
        //if white queen side rook is captured
        else if(this.movedSquare == 1 && this.chessBoardArray[0] != 'R'){
            this.castelDetails.whiteQueenSideRookCaptured = true;
        }
        //if black queen side rook is captured
        else if(this.movedSquare == 57 && this.chessBoardArray[56] != 'r'){
            this.castelDetails.blackQueenSideRookCaptured = true;
        }
        //if black king side rook is captured
        else if(this.movedSquare == 64 && this.chessBoardArray[63] != 'r'){
            this.castelDetails.blackKingSideRookCaptured = true;
        }

        //check remaining six conditions checking squares for castel blocking

        const currentPlayer = this.fenPosition.split(" ")[1];

        const whiteKingSquare = 5;
        const whiteKingSideSquares = [6, 7];
        const whiteQueenSideSquares = [4, 3, 2];

        const blackKingSquare = 61;
        const blackKingSideSquares = [62, 63];
        const blackQueenSideSquares = [60, 59, 58];

        const tempFenPos = newPiecesPlacements + " " + currentPlayer + " - 0 1"

        const boardDetailsObj = new ChessBoardArrayFiller(tempFenPos);

        const brd = boardDetailsObj.fillChessBoardArray();
        const moves = boardDetailsObj.fillPiecesMoveDetectionArray(brd);

        const pieceDetailsObj = new PiecesMovementManager(brd, moves, currentPlayer, tempFenPos);
        const allPieceMoves = pieceDetailsObj.piecesMovementDetails();

        let tempWhiteDetails;
        let tempBlackDetails;

        if(currentPlayer == 'w'){
            tempWhiteDetails = allPieceMoves[0];
            tempBlackDetails = allPieceMoves[1];
        }
        else{
            tempWhiteDetails = allPieceMoves[1];
            tempBlackDetails = allPieceMoves[0];
        }

        //If king is checked in initial positions
        this.castelDetails.whiteKingChecked = this.findSquareIncluded(whiteKingSquare, tempBlackDetails);
        this.castelDetails.blackKingChecked = this.findSquareIncluded(blackKingSquare, tempWhiteDetails);
        
        this.castelDetails.whiteKingSideSquaresChecked = this.findArrayIncluded(whiteKingSideSquares, tempBlackDetails);
        this.castelDetails.whiteQueenSideSquaresChecked = this.findArrayIncluded(whiteQueenSideSquares, tempBlackDetails);

        this.castelDetails.blackKingSideSquaresChecked = this.findArrayIncluded(blackKingSideSquares, tempWhiteDetails);
        this.castelDetails.blackQueenSideSquaresChecked = this.findArrayIncluded(blackQueenSideSquares, tempWhiteDetails);

    }
    
    findArrayIncluded(arr, pieceDetails){

        for(let i = 0; i < arr.length; i++){
            for(let j = 0; j < pieceDetails.length; j++){
                if(pieceDetails[j].availableSquares.includes(arr[i])){
                    return true;
                }
            }
        }
        return false;
    }

    findSquareIncluded(sq, pieceDetails){

        for(let i = 0; i < pieceDetails.length; i++){
            if(pieceDetails[i].availableCaptures.includes(sq)){
                return true;
            }
        }
        return false;
    }

    castelRigths(){

        let tempCastelRights = [];

        if(!this.castelDetails.whiteKingMoved && !this.castelDetails.whiteKingChecked){
            if(!this.castelDetails.whiteKingSideRookCaptured && !this.castelDetails.whiteKingSideRookMoved && !this.castelDetails.whiteKingSideSquaresChecked){
                tempCastelRights.push('K');
            }
            if(!this.castelDetails.whiteQueenSideRookCaptured && !this.castelDetails.whiteQueenSideRookMoved && !this.castelDetails.whiteQueenSideSquaresChecked){
                tempCastelRights.push('Q');
            }
        }

        if(!this.castelDetails.blackKingMoved && !this.castelDetails.blackKingChecked){
            if(!this.castelDetails.blackKingSideRookCaptured && !this.castelDetails.blackKingSideRookMoved && !this.castelDetails.blackKingSideSquaresChecked){
                tempCastelRights.push('k');
            }
            if(!this.castelDetails.blackQueenSideRookCaptured && !this.castelDetails.blackQueenSideRookMoved && !this.castelDetails.blackQueenSideSquaresChecked){
                tempCastelRights.push('q');
            }
        }

        if(tempCastelRights.length == 0){
            return "-";
        }
        return tempCastelRights.join("");
    }

    moveForDraw(){
        const pieceName = this.clickedPieceDetail.pieceName;

        if(pieceName == 'p' || pieceName == 'P'){
            return 0;
        }

        if(this.clickedPieceDetail.availableCaptures.includes(this.movedSquare)){
            return 0;
        }
        return parseInt(this.fenPosition.split(" ")[4]) + 1;
    }

    getUnphasantsq(tempFenPos){

        const pieceName = this.clickedPieceDetail.pieceName;

        if((pieceName == 'p' || pieceName == 'P') && (parseInt(this.movedSquare) == parseInt(this.clickedPieceDetail.currentSquare) + 8*2 || parseInt(this.movedSquare) == parseInt(this.clickedPieceDetail.currentSquare) - 8*2)){
            const currentPlayer = this.fenPosition.split(" ")[1];
            const fenPos = tempFenPos + " " + currentPlayer + " - 0 1";

            const boardDetailsObj = new ChessBoardArrayFiller(fenPos);

            const brd = boardDetailsObj.fillChessBoardArray();
            const moves = boardDetailsObj.fillPiecesMoveDetectionArray(brd);

            if(pieceName == 'p'){
                if(moves[boardDetailsObj.arrayIndexToSqNum(this.movedSquare + 1) - 1] == 'P' || moves[boardDetailsObj.arrayIndexToSqNum(this.movedSquare - 1) - 1]  == 'P'){
                    return this.sqToBrdNotation(parseInt(this.movedSquare) + 8);
                }
            }
            else{
                if(moves[boardDetailsObj.arrayIndexToSqNum(this.movedSquare + 1) - 1] == 'p' || moves[boardDetailsObj.arrayIndexToSqNum(this.movedSquare - 1) - 1]  == 'p'){
                    return this.sqToBrdNotation(parseInt(this.movedSquare) - 8);
                }
            }

            const PiecesMovementManagerObj = new PiecesMovementManager();
        }
        return '-';
    }

    sqToBrdNotation(num){
        const rank = num % 8 == 0 ? num / 8 : (num - num % 8)/8 + 1;
        const file = 8 - (rank * 8 - num);
        const fileArrs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return fileArrs[file - 1] + rank;
    }


    getNextPlayer(){
        const player = this.fenPosition.split(" ")[1] == 'b' ? 'w' : 'b';
        return player;
    }

    getPiecesPlacemnetPosition(tempChessBoardArray){
        let tempFenPos = "";
        let spaces = 0;
    
        let counter = 1;
    
        for(let i = 0; i < tempChessBoardArray.length; i++){
    
            let charEle = tempChessBoardArray[i];
    
            if(charEle != 0){
                //Get character here
                tempFenPos += charEle;
            }
            else{
                //get spaces here
                spaces++;
                //if next sq is character
                if(tempChessBoardArray[i+1] != 0 || counter == 8){
                    tempFenPos += spaces;
                    spaces = 0;
                }
            }
    
            if(counter == 8 && i != tempChessBoardArray.length -1){
                tempFenPos += "/";
                counter = 0;
            }
            counter++;
        }
        return tempFenPos.split("/").reverse().join("/");
    }

    returnUpdatedCastelInfos(){
        return this.castelDetails;
    }
}