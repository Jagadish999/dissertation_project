class GameStatusChecker{

    //If opponents capturable square has your kings current square
    findCheck(playerColor, yourPossibleMoves, opponentPossibleMoves){

        let kingPiece = playerColor == 'w' ? 'K' : 'k';
        let kingSquare;

        for(let i = 0; i < yourPossibleMoves.length; i++){

            if(yourPossibleMoves[i].pieceName == kingPiece){
                kingSquare = yourPossibleMoves[i].currentSquare;
                break;
            }
        }


        for(let i = 0; i < opponentPossibleMoves.length; i++){
            for(let j = 0; j < opponentPossibleMoves[i].availableCaptures.length; j++){

                if(opponentPossibleMoves[i].availableCaptures[j] == kingSquare){
                    return true;
                }
            }
        }

        return false;
    }

    //If check and no available moves and available captures
    findCheckmate(yourPossibleMoves, checkStatus){
        if(checkStatus){
            for(let i = 0; i < yourPossibleMoves.length; i++){
                
                if(yourPossibleMoves[i].availableCaptures.length > 0 || yourPossibleMoves[i].availableSquares.length > 0){
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    //If no check but no squares to move
    findStalemate(fenPosition, yourPossibleMoves, checkStatus, opponentPossibleMoves){

        //stalemate by repeation of 50 moves
        if(fenPosition.split(" ")[4] > 49){
            return true;
        }

        //If no check but no squares to move
        if(!checkStatus){
            for(let i = 0; i < yourPossibleMoves.length; i++){
                if(yourPossibleMoves[i].availableCaptures.length > 0 || yourPossibleMoves[i].availableSquares.length > 0){
                    return false;
                }
            }
            return true;
        }

        //If final piece remaining is king
        if(yourPossibleMoves.length == 1 && opponentPossibleMoves.length == 1){
            return true;
        }

        return false;
    }
}