<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Play Online</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/play.css">

    <script src = "/js/BoardSetup/BlankChessBoard.js"></script>
    <script src = "/js/BoardSetup/ChessPieceSetter.js"></script>

    <script src = "/js/play.js"></script>

</head>
<body>

    <div class = "main-container">

        <div class = "side-nav">
            <nav>
                <li><a href="/dashboard" class = "dashboard-nav-list">Dashboard</a></li>
                <li><a href="/play" class = "play-nav-list">Play</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/puzzle">Puzzles</a></li>
                <li><a href="/addpuzzle">Add Puzzles</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
                <li><a href="/analysis">Analysis</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">
            <div class = "brdContent">

            </div>

            <div class = "game-modes">
                <div class = "modes-container">
                    <h1>Game Modes</h1>
                    <div class = "mode-category">
                        <div class = "engine">
                            <div class = "engine-heading">Player Vs Computer</div>
                            <ul class = "engine-levels">
                                <li>
                                    <h3>Level 1:</h3>
                                    <a href="/play/engine/level-1-black" class = "black">Black</a>
                                    <a href="/play/engine/level-1-white" class = "white">White</a>
                                </li>
                            </ul>
                        </div>

                        <div class = "online-category">
                            <div class = "online">
                                <div class = "online-heading">Online Match</div>
                                <ul class = "online-modes">
                                    <li class = "GameMode blitz"><a href="#">Blitz: 1 min</a></li>
                                    <li class = "GameMode bullet"><a href="#">Bullet: 3 min</a></li>
                                    <li class = "GameMode classic"><a href="#">Classic: 10 min</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <div class = "matching-player-infos">

        <div class = "sign-area">
            <div class = "sign-cross"><span>&times;</span></div>
        </div>

        <div class = "match-making-message">
            <h1>Finding Player </h1>
            
        </div>

    </div>

    <script src = "{{asset('build/assets/app-4212186a.js')}}"></script>

    <script>

        const api = @json($data);
        console.log(api);

        const yourId = api.id;

        let playersRequested = [];

        Echo.join('PlayerMatchedSuccessfully')
        .listen('PlayerRedirection', (event) => {

            const eventData =  event.matchedPlayer;
            console.log(eventData);

            console.log("Channel Id is: " + eventData.channelId);

            if(yourId == eventData.player1Id || yourId == eventData.player2Id){
                console.log("You Will be redirected");
                window.location.href = '/play/online/' + eventData.channelId;
            }
        });


        Echo.join('onlineUsers')
        //Details of joined users
        .here((user) => {

        })
        .joining((user) => {

        })
        .leaving((user) => {

        })
        .listen('MatchMaking', (event) => {
            
            const tempData = JSON.parse(event.data);

            //Do not record same request twice
            if(!dataAlreadyExist(playersRequested, tempData)){

                playersRequested.push(tempData);

                //Find if player can be matched and redirected to play ground
                matchingPlayerInfo = findMatchingPlayer(playersRequested, tempData);

                console.log("Player found is: ", matchingPlayerInfo);
                console.log(matchingPlayerInfo);

                //player found
                if(playersRequested.length > 0 && matchingPlayerInfo != -1){
                    
                    console.log("Player found")
                    //crear all the request of players
                    console.log(playersRequested);
                    clearAllGameRequest(playersRequested, tempData.id, matchingPlayerInfo.id);
                    console.log(playersRequested);

                    console.log(tempData.gameMode);

                    const requiredData = {
                        player1Id : tempData.id,
                        player2Id : matchingPlayerInfo.id,
                        gameType : tempData.gameMode
                    };

                    if(yourId == tempData.id){
                        const redirectURL = "/playersMatched";
                        sendPostRequest(requiredData, redirectURL, 'POST');
                    }
                }
            }
        });

        const gameModeSelectBtn = document.getElementsByClassName('GameMode');

        for(let i = 0; i < gameModeSelectBtn.length; i++){

            gameModeSelectBtn[i].addEventListener('click', async () => {

                const gameMode = gameModeSelectBtn[i].className.split(" ")[1];
                let rating;
                if(gameMode == "blitz"){
                    rating = api.blitz;
                }
                else if(gameMode == "classic"){
                    rating = api.classic;
                }
                else{
                    rating = api.bullet;
                }
                
                const data = {
                    id : api.id,
                    gameMode : gameMode,
                    rating : rating
                }

                //Sending post request if player selectes game type to play
                sendPostRequest(data, '/playerSelectedGameType', 'POST')
                
            });
        }

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

        function findMatchingPlayer(dataArray, playerData) {

            for (const data of dataArray) {

                const playerRating = Math.floor(playerData.rating);
                const dataRating = Math.floor(data.rating);

                if (
                    (Math.abs(playerRating - dataRating) <= 50) &&
                    (data.gameMode == playerData.gameMode) && playerData.id != data.id
                    )
                
                {
                    return data; // Found a matching player data
                }
            }

            return -1; // No matching player data found
        }

        function clearAllGameRequest(dataArray, playerId1, playerId2) {
            for (let i = dataArray.length - 1; i >= 0; i--) {
                if (dataArray[i].id === playerId1 || dataArray[i].id === playerId2) {
                    dataArray.splice(i, 1);
                }
            }
        }

        async function sendPostRequest(requiredData, redirectURL, method){

            try {

                const response = await fetch(redirectURL, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(requiredData)
                });

            } 
            catch (error) {
                console.error('Error:', error);
            }
        }
    </script>

</body>
</html>