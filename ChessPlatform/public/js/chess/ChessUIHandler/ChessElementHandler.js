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

    getChessBoard(){
        return this.boardWithPieces;
    }

}
