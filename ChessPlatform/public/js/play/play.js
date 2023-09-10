function mainFunctionLoader(){
    gameModeSelected();
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
            console.log("Match Number is: " + matchNumber);
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