/*
BlankChessBoard class returns empty board accoring to board Colors and heigth and width
*/
class BlankChessBoard{

    constructor(brdFirstColor, brdSecondColor, brdHeight, brdWidth){
        this.brdFirstColor = brdFirstColor;
        this.brdSecondColor = brdSecondColor;
        this.brdHeight = brdHeight;
        this.brdWidth = brdWidth;
    }

        //method to create square empty chess board 
        createBoard(){

            const boardHeight = this.brdHeight;
            const boardWidth = this.brdWidth;

            const brdFirstColor = this.brdFirstColor;
            const brdSecondColor = this.brdSecondColor;

            const boardClassName = "newChessBrd";
            const backgroundColor = 'rgba(0, 0, 0, 0)';
    
            const chessBoard = this.boardSquare(boardHeight, boardWidth, boardClassName, backgroundColor);
            chessBoard.style.display = 'flex';
            chessBoard.style.flexDirection = 'column';
            chessBoard.style.flexWrap = 'wrap';
    
            //sqColor for color variation
            let sqColor;
    
            for(let RANKS = 8; RANKS > 0; RANKS--){
    
                let allRanks = this.boardSquare(boardHeight / 8, boardWidth, "Rank" + RANKS, backgroundColor);
    
                allRanks.style.display = 'flex';
                allRanks.style.flexDirection = 'row';
                chessBoard.appendChild(allRanks);
        
                if(RANKS % 2 == 0){
                    sqColor = brdSecondColor;
                }
                else{
                    sqColor = brdFirstColor;
                }
        
                for(var FILES = 1; FILES <= 8; FILES++){
        
                    var eachSq = this.boardSquare(boardHeight / 8, boardWidth / 8, ((RANKS - 1) * 8 + FILES), sqColor);
                    allRanks.appendChild(eachSq);
        
                    if(sqColor == brdSecondColor){
                        sqColor = brdFirstColor;
                    }
                    else{
                        sqColor = brdSecondColor;
                    }
                }
            }
            return chessBoard;
        }

    //method to return div element for squares in board
    boardSquare(height, width, className, bgColor){

        let square = document.createElement('div');

        square.style.height = height + 'px';
        square.style.width = width + 'px';
        square.style.backgroundColor = bgColor;
        square.className = className;

        return square;
    }
}