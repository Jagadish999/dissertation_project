<div class = "main-chess-board-moves">

    <div class = "chessBrd-area">

    </div>

    <div class = "moveDetail-area">
        <div class = "player1Details">

            <img src="/Images/Profile/Stockfish.png" alt="stockfish or player image" class = "imageTop">
            <h2 class = "topName">Stockfish Level 99</h2>
            
        </div>

        <div class = "moves-details">

            <div class = "message-to-user"></div>
            <div class = "moves-details-wrapper">

            </div>
        </div>

        <div class = "player2Details">

            <img src="/Images/Profile/Stockfish.png" alt="stockfish or player image" class = "imageButtom">
            <h2 class = "buttomName">Stockfish Level 99</h2>

        </div>

        <div class="gameControllers">

            <div class="before-verification">
                <input class="fenPosPuzzle" type="text" id="fenInput" name="fenInput" placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR">

                <select id="numberOfMoves" name="numberOfMoves">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>

                <a href="#" id="validateButton">
                    <i class="fas fa-check-circle"></i> Validate
                </a>
            </div>


            <div class = "after-verfication">
                <div class="position-controller">
                    <a href="#" class="previous">&laquo; Previous</a>
                    <a href="#" class="next">Next &raquo;</a>
                    <a href="#" class="exit-game">
                    <i class="fas fa-times-circle"></i> Cancel
                    </a>
                </div>
            </div>

            <div class="leavel">
                <a href="#" class="exit-button">
                    Exit
                </a>
            </div>

        </div>

    </div>

</div>
