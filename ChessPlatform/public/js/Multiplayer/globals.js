let mainApiInfo;
let apiInfos;

//your detail
let yourId;
let yourName;

//Remaining times
let whiteRemainingTime;
let blackRemainingTime;

let whiteTimeInterval;
let blackTimeInterval;

//globals for board presentation
let fenPosition;
let playerColor;
let castelDetails;

//for moves detection
let chessBoardArray = new Array(64);
let piecesMoveDetectionArray = new Array(120);

//All the legal moves of both player
let yourMoves;
let opponentMoves;

//Game current Status;

let timeOver = false;

let check;
let checkmate;
let stalemate;

//If player selects a piece to move
let clickedPieceDetails = null;
let movedSquare;


const moveAudio = new Audio('/Sounds/move.mp3');
const captureAudio = new Audio('/Sounds/Capture.mp3');
const checkAudio = new Audio('/Sounds/Check.mp3');
const castlingAudio = new Audio('/Sounds/Castling.mp3');
const checkmateAudio = new Audio('/Sounds/Checkmate.mp3');
const drawAudio = new Audio('/Sounds/Draw.mp3');

