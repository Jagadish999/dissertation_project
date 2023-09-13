class ChessElementHandler {
    constructor(fenPosition, viewFromPlayer) {
        this.fenPosition = fenPosition;
        this.viewFromPlayer = viewFromPlayer;
        this.brdFirstColor = '#b48766';
        this.brdSecondColor = '#edd9b6';
        this.brdHeight = 650;
        this.brdWidth = 650;

        this.emptyBoardObj = new BlankChessBoard(this.brdFirstColor, this.brdSecondColor, this.brdHeight, this.brdWidth);
        this.boardWithPiecesObj = new BlankChessBoard(this.brdFirstColor, this.brdSecondColor, this.brdHeight, this.brdWidth);

        this.emptyBoard = this.createEmptyBoard();
        this.boardWithPieces = this.createBoardWithPieces();

    }

    getBoardWithRequiredSize(size, fenPosition, playerColor){

        const emptyBrdObj = new BlankChessBoard('#b48766', '#edd9b6', size, size);
        const emptyBrd = emptyBrdObj.createBoard();
        const pieceSetter = new ChessPieceSetter(emptyBrd, fenPosition, playerColor)

        
        const brwWithPieces = pieceSetter.setPieces();

        return brwWithPieces;
    }

    createEmptyBoard() {
        return this.emptyBoardObj.createBoard();
    }

    createBoardWithPieces() {
        const chessPieceSetterObj = new ChessPieceSetter(this.boardWithPiecesObj.createBoard(), this.fenPosition, this.viewFromPlayer);
        return chessPieceSetterObj.setPieces();
    }

    placeChildElementInParentElement(childElement, parentElement) {
        parentElement.appendChild(childElement);
    }

    clearParentElement(parentElement) {
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }
    
    getBoardWithPieces() {
        return this.boardWithPieces;
    }

    getEmptyBoard() {
        return this.emptyBoard;
    }

    setBoardWithMove(move){

        const firstSquareToHighlight = move.split(" ")[1];
        const secondSquareToHighlight = move.split(" ")[2];

        this.boardWithPieces.getElementsByClassName(firstSquareToHighlight)[0].style.backgroundColor = 'grey';
        this.boardWithPieces.getElementsByClassName(firstSquareToHighlight)[0].style.border = '2px solid black';

        this.boardWithPieces.getElementsByClassName(secondSquareToHighlight)[0].style.backgroundColor = 'grey';
        this.boardWithPieces.getElementsByClassName(secondSquareToHighlight)[0].style.border = '2px solid black';
    }

    setBoardWithCheckedSquarePieces(kingSquare){

        this.boardWithPieces.getElementsByClassName(kingSquare)[0].style.backgroundColor = "#5B5EA6";
        this.boardWithPieces.getElementsByClassName(kingSquare)[0].style.border = "2px solid black";
    }

    getChessBoard(){
        return this.boardWithPieces;
    }

    setHintForPlayer(sq1, sq2){
        this.boardWithPieces.getElementsByClassName(sq1)[0].style.backgroundColor = "red";
        this.boardWithPieces.getElementsByClassName(sq1)[0].style.border = "2px solid black";

        console.log(this.boardWithPieces.getElementsByClassName(sq1)[0]);
        this.boardWithPieces.getElementsByClassName(sq2)[0].style.backgroundColor = "red";
        this.boardWithPieces.getElementsByClassName(sq2)[0].style.border = "2px solid black";
    }

    createMoveElements(moveArray) {
        const movesWrapper = document.createElement('div');
        movesWrapper.classList.add('moves-details-wrapper');
        
        const totalMoves = moveArray.length;
      
        for (let i = totalMoves - 1; i >= 0; i--) {
          const moveElement = document.createElement('div');
          const moveText = moveArray[i].split(' ');
      
          // Determine the move number based on whether there is only one move or multiple moves
          const moveNumber = totalMoves > 1 ? i + 1 : 1; // Always start with 1 if there's only one move
      
          // Create the move text based on the components
          let moveTextString = '';
      
          // Add the move number
          moveTextString += `${moveNumber}. `;
      
          // Add the move description
          moveTextString += moveText.join(' ');
      
          moveElement.textContent = moveTextString;
      
          if (i === totalMoves - 1) {
            moveElement.classList.add('finalMove');
          }
      
          movesWrapper.appendChild(moveElement);
        }
      
        return movesWrapper;
      }
      
}
