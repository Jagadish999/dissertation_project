class PuzzleChecker{

    constructor(fenPosition){
        this.fenPosition = fenPosition;
    }

    returnCastelDetails(){

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
        
        const castelPerms = this.fenPosition.split(" ")[2].split("");
      
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

    checkFenPositionValidation() {

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

        const pieceArray = 'rnbqkpRNBQKP';
        const castlingPerms = 'KQkq-';
        
        const fenArray = this.fenPosition.split(" ");
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
}