class ClickOnBoard{
    constructor(board){
        this.board = board;
    }

    //click can be in any squares inside board
    trackAllSquares(){

        for(let i = 0; i < this.board.childNodes.length; i++){

            for(let j = 0; j < this.board.childNodes[i].childNodes.length; j++){
                this.board.childNodes[i].childNodes[j].addEventListener('click', this.squareSelectedAction);
            }
        }
    }

    //your turn
    squareSelectedAction(board){

        //if clicked in own piece
        if(this.className.split(" ")[1] == "hoveredPiece"){
            this.className = this.className.split(" ")[0] + " clicked";
        }
        //if clicked in own piece twice
        else if(this.className.split(" ")[1] == "clicked"){
            //make board normal
            this.className = this.className.split(" ")[0] + " hoveredPiece";
        }
        else if(this.className.split(" ")[1] == "moveable"){
            //if clicked in moveable square
            console.log("This piece will move now");
        }
        else if(this.className.split(" ")[1] == "capturable"){
            //if clicked in capturable square
            console.log("Piece caputure");
        }
        
    }

    makeNormalBoard(){
        console.log("akisdjfsakmfd");
    }
}