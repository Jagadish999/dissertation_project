function extraFunLoader(){

    const board = document.getElementsByClassName('chessBoard')[0];

    for(let i = 0; i < board.childNodes.length; i++){

        for(let j = 0; j < board.childNodes[i].childNodes.length; j++){
            board.childNodes[i].childNodes[j].addEventListener('click', clickOnBoard);
        }
    }
}
//If any square is clicked
function clickOnBoard(){
    currentlyClickedSquare = findSquareNumber(this);

    if(ownPieceClicked()){

        initialPiecePosition = currentlyClickedSquare;
        updateBoard();
        highlightMoves();
    }
    else if(pieceMoved()){

        afterPiecePosition = findSquareNumber(this);
        updateFenPosition();
        updateBoard();
        clearGlobals();
    }
    else{
        updateBoard();
        clearGlobals();
    }
}

function clearGlobals(){
    currentlyClickedSquare = null;
    initialPiecePosition = null;
    afterPiecePosition = null;
    clickedPiece = {};
}

function updateFenPosition(){
    if(playerColor == "white"){
        playerColor = "black";
    }
    else{
        playerColor = "white";
    }

    const click = findRankAndFile(initialPiecePosition) - 1;
    const move = findRankAndFile(afterPiecePosition) - 1;
    orgChessBrd[move] = orgChessBrd[click];
    orgChessBrd[click] = 0;

    console.log("piece clicked is: " + click);
    console.log("piece moved is: " + move);


    console.log("You have moved piece from " + initialPiecePosition + " to " + afterPiecePosition);
    // console.log("Currently clicked sq: " + currentlyClickedSquare);
    
    currentFenPosition = returnNewPosition().split(" ")[0].split("").reverse().join("") + " " + playerColor[0] + " KQkq - 0 1";
}

function findRankAndFile(num){
    //In displayed board Rank:8-1, Files:1-8
    let rank;
    let file;
    for(let ranks = 8; ranks >= 1; ranks--){
        for(let files = 1; files <= 8; files++){
            if(((ranks * 8) - (8 - files)) == num){
                rank = ranks;
                file = files;
                break;
            }
        }
    }

    return (rank * 8) - (file - 1);
}

function returnNewPosition(){

    let tempFenPos = "";
    let spaces = 0;

    let counter = 1;

    for(let i = 0; i < orgChessBrd.length; i++){

        let charEle = orgChessBrd[i];

        if(charEle != 0){
            //Get character here
            tempFenPos += charEle;
        }
        else{
            //get spaces here
            spaces++;
            //if next sq is character
            if(orgChessBrd[i+1] != 0 || counter == 8){
                tempFenPos += spaces;
                spaces = 0;
            }
        }

        if(counter == 8 && i != orgChessBrd.length -1){
            tempFenPos += "/";
            counter = 0;
        }
        counter++;
    }
    return tempFenPos;
}

function pieceMoved(){
    if(Object.keys(clickedPiece) != 0){
        if(clickedPiece.availableSq.includes(currentlyClickedSquare)){
            return true;
        }
        else if(clickedPiece.availableCaptures.includes(currentlyClickedSquare)){
            return true;
        }
    }
    return false;
}

function highlightMoves(){
    const board = document.getElementsByClassName('chessBoard')[0];
    for(let i = 0; i < board.childNodes.length; i++){

        for(let j = 0; j < board.childNodes[i].childNodes.length; j++){
            board.childNodes[i].childNodes[j].addEventListener('click', clickOnBoard);
            if(clickedPiece.availableSq.includes(parseInt(board.childNodes[i].childNodes[j].className))){
                board.childNodes[i].childNodes[j].className += " moveable";
            }
            else if(clickedPiece.availableCaptures.includes(parseInt(board.childNodes[i].childNodes[j].className))){
                board.childNodes[i].childNodes[j].className += " capturable";
            }
        }
    }
}

function updateBoard(){
    //first remove initial board
    const mainContainer = document.getElementsByClassName('main-container')[0];
    while(mainContainer.firstChild){
        mainContainer.removeChild(mainContainer.firstChild);
    }
    mainEventLoader();
}

function ownPieceClicked(){
    for(let i = 0; i < yourPiecesDetails.length; i++){
        if(yourPiecesDetails[i].currentSq == currentlyClickedSquare){
            clickedPiece = yourPiecesDetails[i];
            return true;
        }
    }
    return false;
}

//Pass clicked element and get square number
function findSquareNumber(clickedSquareElement){
    const board = document.getElementsByClassName('chessBoard')[0];

    let ranks = 8;
    let files = 1;

    for(let i = 0; i < board.childNodes.length; i++){


        for(let j = 0; j < board.childNodes[i].childNodes.length; j++){
            
            if(clickedSquareElement == board.childNodes[i].childNodes[j]){

                return rankAndFileToSq(files, ranks);

            }
            files++;
        }

        ranks--;
        files=1;
    }
}

function rankAndFileToSq(file, rank){

    const totalSq = rank * 8;
    const extraSq = 8 - file;

    return totalSq - extraSq;
}