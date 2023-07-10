class HoverEffect{
    constructor(board, yourPieceDetails){
        this.board = board;
        this.yourPieceDetails = yourPieceDetails;
    }

    //Hover effect in own pieces
    hoverEffectInOwnPieces(){

        let tempSquareNums = [];

        //know all the square numbers where your pieces are
        for(let i = 0; i < this.yourPieceDetails.length; i++){
            tempSquareNums.push(this.yourPieceDetails[i].currentSq);
        }

        //loop thorugh each square in board
        for(let i = 0; i < this.board.childNodes.length; i++){

            for(let j = 0; j < this.board.childNodes[i].childNodes.length; j++){

                if(tempSquareNums.includes(parseInt(this.board.childNodes[i].childNodes[j].className))){
                    this.board.childNodes[i].childNodes[j].className += " hoveredPiece";
                }
            }
        }
    }
}