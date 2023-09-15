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
        if(fenPosition.split(" ")[4] == 50){
            return true;
        }
        //If only kings are remaining
        else if(yourPossibleMoves.length == 1 && opponentPossibleMoves.length == 1){

            return true;
        }
        //If both player have only king and bishop or king and night
        else if(yourPossibleMoves.length < 3 && opponentPossibleMoves.length < 3){

            let insufficientYourMaterial = false;
            let insufficientOpponentMaterial = false;

            for(let i = 0; i < yourPossibleMoves.length; i++){

                if(yourPossibleMoves[i].pieceName != 'K' && yourPossibleMoves[i].pieceName != 'k'){

                    if(yourPossibleMoves[i].pieceName == 'n' || yourPossibleMoves[i].pieceName == 'b' || yourPossibleMoves[i].pieceName == 'N' || yourPossibleMoves[i].pieceName == 'B'){

                        insufficientYourMaterial = true;
                    }
                }
            }

            if(yourPossibleMoves.length == 1){
                insufficientYourMaterial = true;
            }

            for(let i = 0; i < opponentPossibleMoves.length; i++){

                if(opponentPossibleMoves[i].pieceName != 'K' && opponentPossibleMoves[i].pieceName != 'k'){

                    if(opponentPossibleMoves[i].pieceName == 'n' || opponentPossibleMoves[i].pieceName == 'b' || opponentPossibleMoves[i].pieceName == 'N' || opponentPossibleMoves[i].pieceName == 'B'){

                        insufficientOpponentMaterial = true;
                    }
                }
            }

            if(opponentPossibleMoves.length == 1){
                insufficientOpponentMaterial = true;
            }
            
            if(insufficientYourMaterial && insufficientOpponentMaterial){
                return true;
            }
        }

        //If no check but no squares to move
        else if(!checkStatus){

            let allMovesEmpty = 0;
            for(let i = 0; i < yourPossibleMoves.length; i++){
                if(yourPossibleMoves[i].availableCaptures.length == 0 && yourPossibleMoves[i].availableSquares.length == 0 && yourPossibleMoves[i].castelSquare.length == 0 && yourPossibleMoves[i].unphasantSquare.length == 0 ){
                    allMovesEmpty++;
                }
                else{
                    break;
                }
            }

            if(yourPossibleMoves.length == allMovesEmpty ){
                return true;
            }
        }

        //If final piece remaining is king

        return false;
    }
}