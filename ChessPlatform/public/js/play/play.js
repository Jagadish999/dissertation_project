//Record of all the players waiting to play matches
let playersRequested = [];

//Player Found and both players are redirected
Echo.join('PlayerMatchedSuccessfully')
.listen('PlayerRedirection', (event) => {

    const eventData =  event.matchedPlayer;

    if(userInfos.id == eventData.player1Id || userInfos.id == eventData.player2Id){
        window.location.href = '/play/online/' + eventData.channelId;
    }
});

//Players Submitted search request to play
Echo.join('onlineUsers')
.listen('MatchMaking', (event) => {
            
    const playerFindingMatch = JSON.parse(event.data);

    //Do not record same request twice
    if(!dataAlreadyExist(playersRequested, playerFindingMatch)){

        //Push data of player which is searching for opponent
        playersRequested.push(playerFindingMatch);

        //Find if player can be matched and redirected to play ground
        matchingPlayerInfo = findMatchingPlayer(playersRequested, playerFindingMatch);

        // You have found the player to play match
        if(playersRequested.length > 0 && matchingPlayerInfo != -1){
            
            //if matching player is found clear all the previous requests
            clearAllGameRequest(playersRequested, playerFindingMatch.id, matchingPlayerInfo.id);

            const requiredData = {
                player1Id : playerFindingMatch.id,
                player2Id : matchingPlayerInfo.id,
                gameType : playerFindingMatch.gameMode
            };

            //Only one of the player will load post method and trigger the event
            if(userInfos.id == matchingPlayerInfo.id){

                //Trigger Event that enters matched players in play ground
                const redirectURL = "/playersMatched";
                const getOrPostRequestObj = new GetOrPostRequest();
                getOrPostRequestObj.sendPostRequest(requiredData, redirectURL);
            }
        }
    }
});

function dataAlreadyExist(dataArray, newData) {

    if (dataArray.length === 0) {
        return false;
    }

    for (const data of dataArray) {

        if (data.id === newData.id && data.gameMode === newData.gameMode) {
            return true;
        }
    }
    return false;
}

//Match Players with rating difference of 100 max
function findMatchingPlayer(dataArray, playerData) {

    //returns user data details if player is found else returns -1
    for (const data of dataArray) {

        const playerRating = Math.floor(playerData.rating);
        const dataRating = Math.floor(data.rating);

        if (
            (Math.abs(playerRating - dataRating) <= 100) &&
            (data.gameMode == playerData.gameMode) && playerData.id != data.id
            )
        
        {
            return data;
        }
    }

    return -1;
}

function clearAllGameRequest(dataArray, playerId1, playerId2) {
    for (let i = dataArray.length - 1; i >= 0; i--) {
        if (dataArray[i].id === playerId1 || dataArray[i].id === playerId2) {
            dataArray.splice(i, 1);
        }
    }
}

function runMatchMakingEvents(){

    const getOrPostRequestObj = new GetOrPostRequest();
    //Keep track of players selecting game modes blitz bullet or classic
    const gameModeSelectBtn = document.getElementsByClassName('GameMode');
    
    let rating;

    for(let i = 0; i < gameModeSelectBtn.length; i++){

        gameModeSelectBtn[i].addEventListener('click', async () => {

            const gameMode = gameModeSelectBtn[i].className.split(" ")[1];
            
            if(gameMode == "blitz"){
                rating = userInfos.blitz;
            }
            else if(gameMode == "classic"){
                rating = userInfos.classic;
            }
            else{
                rating = userInfos.bullet;
            }
            
            const data = {
                id : userInfos.id,
                gameMode : gameMode,
                rating : rating
            }

            //Trigger Event that notifies all players waiting to play
            getOrPostRequestObj.sendPostRequest(data, "/playerSelectedGameType");
        });
    }
}

function mainFunctionLoader(){
    gameModeSelected();
    runMatchMakingEvents();
}

function gameModeSelected(){

    //This is an array of all three buttons
    const gameModeButton = document.getElementsByClassName('GameMode');

    const findingPlayerBoard = document.getElementsByClassName('matching-player-infos')[0];
    const crossBtn = document.getElementsByClassName('sign-cross')[0];
    const mainContainer = document.getElementsByClassName('main-container')[0];

    //Just get click event in buttons
    for(let i = 0; i < gameModeButton.length; i++){
        gameModeButton[i].addEventListener('click', () => {

            dotAnimation();
            findingPlayerBoard.style.display = 'block';
            mainContainer.className += " blure";
        });
    }

    crossBtn.addEventListener('click', () => {
        findingPlayerBoard.style.display = 'none';
        mainContainer.className = "main-container";
    });

    const playAsWhite = document.getElementsByClassName('white');
    const playAsBlack = document.getElementsByClassName('black');

    const getOrPostRequestObj = new GetOrPostRequest();

    for(let i = 0; i < playAsBlack.length; i++){
        playAsWhite[i].addEventListener('click', async () => {

            const requiredData = {
                playerId : parseInt(userInfos.id),
                playerColor : 'w',
                stockfishColor : 'b',
                level :  playAsWhite[i].id,
            }
            
            //Insert data in db inserted
            const matchNumber = await getOrPostRequestObj.sendPostRequest(requiredData, '/engineMatchSelected');

            if(matchNumber > 0){
                window.location.href = '/engineground/' + matchNumber;
            }
            else{
                console.log("Some error!!!");
            }
        });
        playAsBlack[i].addEventListener('click', async () => {

            const requiredData = {
                playerId : parseInt(userInfos.id),
                playerColor : 'b',
                stockfishColor : 'w',
                level :  playAsBlack[i].id,
            }

            //Insert data in db inserted
            const matchNumber = await getOrPostRequestObj.sendPostRequest(requiredData, '/engineMatchSelected');
            if(matchNumber > 0){
                window.location.href = '/engineground/' + matchNumber;
            }
            else{
                console.log("Some error!!!");
            }
        });
    }
}

function dotAnimation(){

    const allDots = document.querySelectorAll('.dot');
    const colors = ['red', 'green', 'blue'];

    let currentColorIndex = 0;
    
    setInterval(() => {
        // Change the color of each dot in every 1000 milisecond
        allDots.forEach((dot, index) => {
            dot.style.color = colors[(currentColorIndex + index) % colors.length];
        });
    
        currentColorIndex++;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', mainFunctionLoader);