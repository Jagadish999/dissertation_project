<div class = "main-chess-board-moves">

    <div class = "chessBrd-area">

    </div>

    <div class = "moveDetail-area">
        <div class = "player1Details">

            <img src="/Images/Profile/{{$userInformation['blackPlayerImage']}}.png" alt="stockfish or player image" class = "imageTop">
            <h2 class = "topName">{{$userInformation['blackPlayerName']}}</h2>
            
        </div>

        <div class = "moves-details">

            <div class = "moves-details-wrapper">

            </div>
        </div>

        <div class = "player2Details">

            <img src="/Images/Profile/{{$userInformation['whitePlayerImage']}}.png" alt="stockfish or player image" class = "imageButtom">
            <h2 class = "buttomName">{{$userInformation['whitePlayerName']}}</h2>

        </div>

        <div class="gameControllers">

        <div class="position-controller">
            <a href="#" class="previous">&laquo; Previous</a>
            <a href="#" class="next">Next &raquo;</a>
            <a href="#" class="best-move">
                <i class="fas fa-trophy"></i> Best Move
            </a>
            <a href="#" class="exit-game">
                <i class="fas fa-sign-out-alt"></i> Exit Game
            </a>
        </div>
        </div>

    </div>

</div>
