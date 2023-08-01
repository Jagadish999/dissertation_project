/*
Class BoardWithPieces places all the chess pieces inside chess board in img element with given fen position
*/

class ChessPieceSetter{

    constructor(board, fenPos, playerColor){
        this.board = board;
        this.fenPos = fenPos;
        this.playerColor = playerColor;
    }

    // sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
    
    //set pieces according to fen position
    setPieces(){

        let fenPosCounter = 0;
    
        //this loop ranges from sq no 57 to 64, 49 to 56 and so on......
        const allRanks = this.board.childNodes;
        
        //Loop sets all the pieces in board
        for(var i = 0; i < allRanks.length; i++){
    
            const sqBoxes = allRanks[i].childNodes;
    
            for(var j = 0; j < sqBoxes.length; j++){
    
                let currentChar = this.fenPos[fenPosCounter];
    
                if(currentChar == '/'){
                    fenPosCounter++;
                    currentChar = this.fenPos[fenPosCounter];
                }
    
                if(currentChar > 0){
                    //incase if we have numbers
                    j += parseInt(currentChar) -1;
                    fenPosCounter ++;
                }
                else{
                    //you have pure character here

                    const tempImgEle = this.returnImgElement(sqBoxes[i].style.height, sqBoxes[i].style.width, currentChar);
                    sqBoxes[j].appendChild(tempImgEle);
    
                    fenPosCounter++;
                }
            }
        }

        if(this.playerColor == 'b'){
            return this.rotateBrdAndPieces(this.board);
        }
        return this.board;
    }

    
    //If player is black rotate the board
    rotateBrdAndPieces(board){
        board.style.position = "relative";
        board.style.transform = "rotate(180deg)";

        for(let i = 0; i < board.childNodes.length; i++){

            for(let j = 0; j < board.childNodes[i].childNodes.length; j++){

                if(board.childNodes[i].childNodes[j].childNodes.length > 0){
                    board.childNodes[i].childNodes[j].childNodes[0].style.position = "relative";
                    board.childNodes[i].childNodes[j].childNodes[0].style.transform = "rotate(180deg)";
                }
            }
        }

        return board;
    }

    //returns img element by setting height, width and img name property
    returnImgElement(height, width, imgName){

        let imgEle = document.createElement('img');
        imgEle.setAttribute("draggable" , true)
        if(imgName == 'p' || imgName == 'r' || imgName == 'k' || imgName == 'q' || imgName == 'b' || imgName == 'n'){
            imgEle.setAttribute("src" , "Images/black_pieces/" + imgName + '.png');
        }
        else{
            imgEle.setAttribute("src" , "Images/white_pieces/" + imgName + '.png');
        }
        
        imgEle.style.height = height;
        imgEle.style.width = width;
    
        return imgEle;
    }
}