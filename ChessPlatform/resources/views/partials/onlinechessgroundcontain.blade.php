<div class = "main-chess-board-moves">

    <div class = "chessBrd-area">

    </div>

    <div class = "moveDetail-area">

        <div class = "player1Details">

            @if($data['playerInfomation']['playerWhiteId'] == $data['playerInfomation']['yourId'])
                <img src="/Images/Profile/{{$data['playerInfomation']['blackPlayerImage']}}.png" alt="stockfish or player image" class="imageTop">
            @endif 
            @if($data['playerInfomation']['playerBlackId'] == $data['playerInfomation']['yourId'])
                <img src="/Images/Profile/{{$data['playerInfomation']['whitePlayerImage']}}.png" alt="stockfish or player image" class="imageTop">
            @endif

            <div class = "details">

                @if($data['playerInfomation']['playerWhiteId'] == $data['playerInfomation']['yourId'])
                    <h3 class = "topName">{{ $data['playerInfomation']['playerBlackName'] }}</h3>
                    <h3 class = "rating">[{{ $data['playerInfomation']['playerBlackRating'] }}]</h3>
                @endif 

                @if($data['playerInfomation']['playerBlackId'] == $data['playerInfomation']['yourId'])
                    <h3 class="topName">{{ $data['playerInfomation']['playerWhiteName'] }}</h3>
                    <h3 class = "rating">[{{ $data['playerInfomation']['playerWhiteRating'] }}]</h3>
                @endif

            </div>

        <i class="fas fa-clock"></i>
        <h3 class = "time opponent">00:00</h3>
    </div>

    <div class = "moves-details">
        <div class = "moves-details-wrapper">
        </div>
    </div>

    <div class = "chat-details">

        <div class = "all-chats">

        </div>


        <div class = "message-input">

            <input type="text" placeholder = "Enter Your Message" class = "textByUser">
            <button class = "send">
            <i class="fas fa-paper-plane"></i>
                Send
            </button>

        </div>

    </div>

        <div class="player2Details">

            @if($data['playerInfomation']['playerWhiteId'] == $data['playerInfomation']['yourId'])
                <img src="/Images/Profile/{{$data['playerInfomation']['whitePlayerImage']}}.png" alt="player image" class="imageButtom">
            @endif 
            @if($data['playerInfomation']['playerBlackId'] == $data['playerInfomation']['yourId'])
                <img src="/Images/Profile/{{$data['playerInfomation']['blackPlayerImage']}}.png" alt="player image" class="imageButtom">
            @endif

            <div class="details">

                @if($data['playerInfomation']['playerWhiteId'] == $data['playerInfomation']['yourId'])
                    <h3 class="buttomName">{{ $data['playerInfomation']['playerWhiteName'] }}</h3>
                    <h3 class = "rating">[{{ $data['playerInfomation']['playerWhiteRating'] }}]</h3>
                @endif
                @if($data['playerInfomation']['playerBlackId'] == $data['playerInfomation']['yourId'])
                    <h3 class="buttomName">[{{ $data['playerInfomation']['playerBlackName'] }}]</h3>
                    <h3 class = "rating">[{{ $data['playerInfomation']['playerBlackRating'] }}]</h3>
                @endif
            </div>
            <i class="fas fa-clock"></i>
            <h3 class="time your">00:00</h3>

        </div>


        <div class="gameControllers">
            <button class="btn-leave">
                <i class="fas fa-sign-out"></i>
                Exit
            </button>
            <button class="btn-chat">
                <i class="fas fa-comment"></i>
                Chat
            </button>
            <button class="btn-move">
                <i class="fas fa-caret-right"></i>
                Moves
            </button>
        </div>

    </div>

</div>


<div class = "matching-player-infos">

    <div class = "sign-area">
        <div class = "sign-cross"><span>&times;</span></div>
    </div>

    <div class = "match-making-message">

        <div class = "findingPlayerHeading">
            <span>Promote Pieces To</span>
        </div>
        
        
        <div class="options">

            <span class = "OptQueen Opt">
                <img src="/Images/white_pieces/Q.png" alt="Queen">
            </span>
            <span class = "OptRook Opt">
                <img src="/Images/white_pieces/R.png" alt="Rook">

            </span>
            <span class = "OptBishop Opt">
                <img src="/Images/white_pieces/B.png" alt="Bishop">

            </span>
            <span class = "OptNight Opt">
                <img src="/Images/white_pieces/N.png" alt="Night">

            </span>
        </div>
    </div>

</div>



<div class = "gameOver-popup">

    <div class = "sign-area-gameover">
        <span>&times;</span>
    </div>

    <div class = "game-over-details">

        <h1>Game Over</h1>

        <div class = "playerWhite">
            <img src="/Images/Profile/{{$data['playerInfomation']['whitePlayerImage']}}.png" alt="player image">
            <h2></h2>
        </div>

        <div class = "playerBlack">
            <img src="/Images/Profile/{{$data['playerInfomation']['blackPlayerImage']}}.png" alt="player image">
            <h2></h2>
        </div>
    </div>

    <div>
        <button class = "Game-Over-exit">
            <i class="fas fa-sign-out"></i>
            Exit
        </button>
    </div>

</div>