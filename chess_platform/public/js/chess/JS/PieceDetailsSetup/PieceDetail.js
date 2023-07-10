/*
Most of the methods provided here just gives temporary data just for testing purposes
Everything here needs to be redesigned
*/
class PieceDetail{

    constructor(orgChessBrd, moveChessBrd, playerColor, currentFenPosition){
        this.orgChessBrd = orgChessBrd;
        this.moveChessBrd = moveChessBrd;
        this.playerColor = playerColor;
        this.currentFenPosition = currentFenPosition;
    }

    opponentPiecesInfo(){

        let tempPieceInfo = [];

        let rank = -1;
        let file = 9;
    
        let counter = 1;
    
        for(let i = 0; i < this.moveChessBrd.length; i++){
    
            if(counter > 10){
                counter = 1;
    
                rank++;
                file = 9;
            }

            if(this.moveChessBrd[i] != 1 && this.moveChessBrd[i] != 0 && this.findOppOrNot(playerColor, moveChessBrd[i])){
                //oppPiecesDetails fillupment here
                const pieceFound = this.moveChessBrd[i];
                const sqAndCap =  this.requiredMoveAndCaptures(pieceFound, i, rank, file);
    
                let tempObj = 
                {
                    "pieceName" : pieceFound,
                    "currentSq" : this.rankAndFileToSq(file, rank),
                    "availableSq" : sqAndCap[0],
                    "availableCaptures" : sqAndCap[1]
                };
    
                tempPieceInfo.push(tempObj);
            }
    
            counter++;
            file--;
        }

        return tempPieceInfo;
    }
    yourPiecesInfo(){

        let tempPieceInfo = [];

        let rank = -1;
        let file = 9;
    
        let counter = 1;
    
        for(let i = 0; i < this.moveChessBrd.length; i++){
    
            if(counter > 10){
                counter = 1;
    
                rank++;
                file = 9;
            }

            if(this.moveChessBrd[i] != 1 && this.moveChessBrd[i] != 0 && !this.findOppOrNot(playerColor, moveChessBrd[i])){

                const pieceFound = this.moveChessBrd[i];
                const sqAndCap =  this.requiredMoveAndCaptures(pieceFound, i, rank, file);
    
                let tempObj = 
                {
                    "pieceName" : pieceFound,
                    "currentSq" : this.rankAndFileToSq(file, rank),
                    "availableSq" : sqAndCap[0],
                    "availableCaptures" : sqAndCap[1]
                };
    
                tempPieceInfo.push(tempObj);
            }
    
            counter++;
            file--;
        }

        return tempPieceInfo;
    }

    requiredMoveAndCaptures(piece, sqIdx, rank, file){

        let tempArr;
    
        if(piece == 'p'){
            tempArr = this.blackPawnMovement(piece, sqIdx, rank, file);
        }
        else if(piece == 'P'){
            tempArr = this.whitePawnMovement(piece, sqIdx, rank, file);
        }
        else if(piece == 'r' || piece == 'R'){
            tempArr = this.rookMovement(piece, sqIdx, rank, file);
        }
        else if(piece == 'n' || piece == 'N'){
            tempArr = this.nightMovement(piece, sqIdx, rank, file);
        }
        else if(piece == 'q' || piece == 'Q'){
            tempArr = this.queenMovement(piece, sqIdx, rank, file);
        }
        else if(piece == 'k' || piece == 'K'){
            tempArr = this.kingMovement(piece, sqIdx, rank, file);
        }
        else {
            tempArr = this.bishopMovement(piece, sqIdx, rank, file);
        }
    
        return tempArr;
    }

    blackPawnMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        if(sqIdx > 80 && sqIdx < 90){
            if(this.moveChessBrd[sqIdx - 20] == 0){
                tempMoves.push(rankAndFileToSq(file, (rank - 2)));
            }
        }

        if(this.moveChessBrd[sqIdx - 10] == 0){
            tempMoves.push(rankAndFileToSq(file, (rank - 1)));
        }
        if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 11])){
            tempCaptures.push(rankAndFileToSq(file + 1, rank - 1));
        }
        if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 9])){
            tempCaptures.push(rankAndFileToSq(file - 1, rank - 1));
        }
        
        return [tempMoves, tempCaptures];
    }
    
    whitePawnMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];
        if(sqIdx > 30 && sqIdx < 40){
            if(this.moveChessBrd[sqIdx + 20] == 0){
                tempMoves.push(rankAndFileToSq(file, rank + 2));

            }
        }

        if(this.moveChessBrd[sqIdx + 10] == 0){
            tempMoves.push(rankAndFileToSq(file, rank + 1));
        }
        if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 11])){
            tempCaptures.push(rankAndFileToSq(file - 1, rank + 1));
        }
        if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 9])){
            tempCaptures.push(rankAndFileToSq(file + 1, rank + 1));
        }

        return [tempMoves, tempCaptures];
    }
    
    rookMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        //rook movement from top to buttom
        let tempSqIdx = sqIdx;
        let keepIteration = true;
        let counter = 1;
        while(keepIteration){
            tempSqIdx += 10;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //rook movement from bottom to top
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;

        while(keepIteration){
            tempSqIdx -= 10;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //rook movement to left
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;

        while(keepIteration){
            tempSqIdx += 1;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

            //rook movement to right
            tempSqIdx = sqIdx;
            keepIteration = true;
            counter = 1;
    
            while(keepIteration){
                tempSqIdx -= 1;
    
                if(this.moveChessBrd[tempSqIdx] == 0){
                    tempMoves.push(this.rankAndFileToSq(file + counter, rank));
                }
                else if(this.moveChessBrd[tempSqIdx] == 1){
                    keepIteration = false;
                }
                else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                    tempCaptures.push(this.rankAndFileToSq(file + counter, rank));
                    keepIteration = false;
                }
                else{
                    keepIteration = false;
                }
                counter++;
            }

        return [tempMoves, tempCaptures];
    }
    
    nightMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        if(this.moveChessBrd[sqIdx + 21] != 1){
            if(this.moveChessBrd[sqIdx + 21] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 1, rank+2));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 21])){
                tempCaptures.push(this.rankAndFileToSq(file - 1, rank+2));
            }
        }
        if(this.moveChessBrd[sqIdx - 21] != 1){
            if(this.moveChessBrd[sqIdx - 21] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 1, rank - 2));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 21])){
                tempCaptures.push(this.rankAndFileToSq(file + 1, rank - 2));
            }
        }
        if(this.moveChessBrd[sqIdx + 12] != 1){
            if(this.moveChessBrd[sqIdx + 12] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 2, rank+1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 12])){
                tempCaptures.push(this.rankAndFileToSq(file - 2, rank+1));
            }
        }
        if(this.moveChessBrd[sqIdx - 12] != 1){
            if(this.moveChessBrd[sqIdx - 12] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 2, rank-1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 12])){
                tempCaptures.push(this.rankAndFileToSq(file + 2, rank-1));
            }
        }
        if(this.moveChessBrd[sqIdx + 19] != 1){
            if(this.moveChessBrd[sqIdx + 19] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 1, rank+2));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 19])){
                tempCaptures.push(this.rankAndFileToSq(file + 1, rank+2));
            }
        }
        if(this.moveChessBrd[sqIdx - 19] != 1){
            if(this.moveChessBrd[sqIdx - 19] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 1, rank - 2));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 19])){
                tempCaptures.push(this.rankAndFileToSq(file - 1, rank - 2));
            }
        }
        if(this.moveChessBrd[sqIdx + 8] != 1){
            if(this.moveChessBrd[sqIdx + 8] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 2, rank+1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 8])){
                tempCaptures.push(this.rankAndFileToSq(file + 2, rank+1));
            }
        }
        if(this.moveChessBrd[sqIdx - 8] != 1){
            if(this.moveChessBrd[sqIdx - 8] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 2, rank-1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 8])){
                tempCaptures.push(this.rankAndFileToSq(file - 2, rank-1));
            }
        }

        return [tempMoves, tempCaptures];
    }
    
    queenMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        //top left diagonal Movement
        let tempSqIdx = sqIdx;
        let keepIteration = true;
        let counter = 1;
        
        while(keepIteration){
            tempSqIdx += 11;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //buttom right diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx -= 11;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file + counter, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file + counter, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //top right diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx += 9;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file + counter, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file + counter, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //buttom left diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx -= 9;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;

        while(keepIteration){
            tempSqIdx += 10;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //rook movement from bottom to top
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;

        while(keepIteration){
            tempSqIdx -= 10;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //rook movement to left
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;

        while(keepIteration){
            tempSqIdx += 1;

            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

            //rook movement to right
            tempSqIdx = sqIdx;
            keepIteration = true;
            counter = 1;
    
            while(keepIteration){
                tempSqIdx -= 1;
    
                if(this.moveChessBrd[tempSqIdx] == 0){
                    tempMoves.push(this.rankAndFileToSq(file + counter, rank));
                }
                else if(this.moveChessBrd[tempSqIdx] == 1){
                    keepIteration = false;
                }
                else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                    tempCaptures.push(this.rankAndFileToSq(file + counter, rank));
                    keepIteration = false;
                }
                else{
                    keepIteration = false;
                }
                counter++;
            }

        return [tempMoves, tempCaptures];
    }
    
    kingMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        if(this.moveChessBrd[sqIdx + 10] != 1){
            if(this.moveChessBrd[sqIdx + 10] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank + 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 10])){
                tempCaptures.push(this.rankAndFileToSq(file, rank + 1));
            }
        }
        if(this.moveChessBrd[sqIdx + 11] != 1){
            if(this.moveChessBrd[sqIdx + 11] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 1, rank + 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 11])){
                tempCaptures.push(this.rankAndFileToSq(file - 1, rank + 1));
            }
        }
        if(this.moveChessBrd[sqIdx + 9] != 1){
            if(this.moveChessBrd[sqIdx + 9] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 1, rank + 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 9])){
                tempCaptures.push(this.rankAndFileToSq(file + 1, rank + 1));
            }
        }
        if(this.moveChessBrd[sqIdx + 1] != 1){
            if(this.moveChessBrd[sqIdx + 1] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 1, rank));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx + 1])){
                tempCaptures.push(this.rankAndFileToSq(file - 1, rank));
            }
        }
        if(this.moveChessBrd[sqIdx - 1] != 1){
            if(this.moveChessBrd[sqIdx - 1] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 1, rank));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 1])){
                tempCaptures.push(this.rankAndFileToSq(file + 1, rank));
            }
        }
        if(this.moveChessBrd[sqIdx - 10] != 1){
            if(this.moveChessBrd[sqIdx - 10] == 0){
                tempMoves.push(this.rankAndFileToSq(file, rank - 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 10])){
                tempCaptures.push(this.rankAndFileToSq(file, rank - 1));
            }
        }
        if(this.moveChessBrd[sqIdx - 11] != 1){
            if(this.moveChessBrd[sqIdx - 11] == 0){
                tempMoves.push(this.rankAndFileToSq(file + 1, rank - 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 11])){
                tempCaptures.push(this.rankAndFileToSq(file + 1, rank - 1));
            }
        }
        if(this.moveChessBrd[sqIdx - 9] != 1){
            if(this.moveChessBrd[sqIdx - 9] == 0){
                tempMoves.push(this.rankAndFileToSq(file - 1, rank - 1));
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[sqIdx - 9])){
                tempCaptures.push(this.rankAndFileToSq(file - 1, rank - 1));
            }
        }

        return [tempMoves, tempCaptures];
    }
    
    bishopMovement(piece, sqIdx, rank, file){
        let tempMoves = [];
        let tempCaptures = [];

        //top left diagonal Movement
        let tempSqIdx = sqIdx;
        let keepIteration = true;
        let counter = 1;
        
        while(keepIteration){
            tempSqIdx += 11;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //buttom right diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx -= 11;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file + counter, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file + counter, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //top right diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx += 9;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file + counter, rank + counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file + counter, rank + counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        //buttom left diagonal Movement
        tempSqIdx = sqIdx;
        keepIteration = true;
        counter = 1;
        
        while(keepIteration){
            tempSqIdx -= 9;
            if(this.moveChessBrd[tempSqIdx] == 0){
                tempMoves.push(this.rankAndFileToSq(file - counter, rank - counter));
            }
            else if(this.moveChessBrd[tempSqIdx] == 1){
                keepIteration = false;
            }
            else if(this.findOppOrNot(this.playerColor, this.moveChessBrd[tempSqIdx])){
                tempCaptures.push(this.rankAndFileToSq(file - counter, rank - counter));
                keepIteration = false;
            }
            else{
                keepIteration = false;
            }
            counter++;
        }

        return [tempMoves, tempCaptures];
    }

    findOppOrNot(color, piece){
        if(color == "black"){
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

    rankAndFileToSq(file, rank){

        const totalSq = rank * 8;
        const extraSq = 8 - file;
    
        return totalSq - extraSq;
    }
}