//The initial fen position of starting game and playerColor for random game
const initialFenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const initialFenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let currentFenPosition = initialFenPosition;

let playerColor = "white";

// for piece identification and move detection
let orgChessBrd = new Array(64);
let moveChessBrd = new Array(120);

//To store all the moves and captures of opponent and player
let oppPiecesDetails = [];
let yourPiecesDetails = [];

//For piece detection
let currentlyClickedSquare;

let afterPiecePosition;
let initialPiecePosition;

let clickedPiece= {};







/* For Future
//demo for knowing our pieces all available moves should be here

let myGameStatus = "normal"; ["checked", "checkmate", "normal", "stalemate"];

let myPiecesDetails = {
    'P': {
        'currentSq' : 24,
        'availableSquares' : [26, 27],
        'availableCaptures' : [25, 28]
    },
    'Q': {
        'currentSq' : 27,
        'availableSq' : [29, 17],
        'availableCaptures' : [25, 28]
    }
}

let oppPiecesDetails = {
    'p': {
        'currentSq' : 24,
        'availableSquares' : [26, 27],
        'availableCaptures' : [25, 28]
    },
    'q': {
        'currentSq' : 27,
        'availableSq' : [29, 17],
        'availableCaptures' : [25, 28]
    }
}

let myPinnedPieces = {
    'P' : {
        'currentSq' = 25
    },
    'Q' : {
        'currentSq' = 32
    }
}

//such api should be sent to server
let positionDetails = {
    'fenPos' : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    'you' : "black"
}
*/