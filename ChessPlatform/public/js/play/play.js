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

    const findingPlayerBoard = document.getElementById('matching-player-dialog');
    const crossBtnMulti = document.getElementById('closeButtonMulti');

    const mainContainer = document.getElementsByClassName('main-container')[0];

    //Just get click event in buttons
    for(let i = 0; i < gameModeButton.length; i++){
        gameModeButton[i].addEventListener('click', () => {

            findingPlayerBoard.style.display = 'block';
            mainContainer.className += " blure";
        });
    }

    crossBtnMulti.addEventListener('click', () => {
        findingPlayerBoard.style.display = 'none';
        mainContainer.className = "main-container";
    });

    const playWithEngine = document.getElementsByClassName('playEngine');
    const customAlert = document.getElementById("customAlert");
    const closeButton = document.getElementById("closeButtonEngine");
    const whiteButton = document.getElementById("whiteButton");
    const blackButton = document.getElementById("blackButton");

    const getOrPostRequestObj = new GetOrPostRequest();

    let levelSelected;

    for(let i = 0; i < playWithEngine.length; i++){
        playWithEngine[i].addEventListener('click', () => {

            customAlert.style.display = "block";
            mainContainer.className += " blure";

            levelSelected = playWithEngine[i].id;
        });
    }

    closeButton.addEventListener("click", function () {
        customAlert.style.display = "none";
        mainContainer.className = "main-container";
    });

    whiteButton.addEventListener("click", async function () {

        customAlert.style.display = "none";
        mainContainer.className = "main-container";

        const requiredData = {
            playerId : parseInt(userInfos.id),
            playerColor : 'w',
            stockfishColor : 'b',
            level :  levelSelected,
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
    
    blackButton.addEventListener("click", async function () {
        customAlert.style.display = "none";
        mainContainer.className = "main-container";

        const requiredData = {
            playerId : parseInt(userInfos.id),
            playerColor : 'b',
            stockfishColor : 'w',
            level :  levelSelected,
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

document.addEventListener('DOMContentLoaded', mainFunctionLoader);