<div class = "main-container">

    <div class = "engine-level-cards">
        <div class = "game-type-description">
            <img src="/Images/logo/stockfish.png" alt="Stockfish Img" class = "stockfish-img">
            <h2>Match Stockfish</h2>
        </div>

        <div class = "engine-modes">
            <div class = "level">
                <h3>Level 1</h3>
                <a href="#" class = "playEngine" id = "1">Play</a>
            </div>
            <div class = "level">
                <h3>Level 2</h3>
                <a href="#" class = "playEngine" id = "2">Play</a>
            </div>
            <div class = "level">
                <h3>Level 3</h3>
                <a href="#" class = "playEngine" id = "3">Play</a>
            </div>
            <div class = "level">
                <h3>Level 4</h3>
                <a href="#" class = "playEngine" id = "4">Play</a>
            </div>
            <div class = "level">
                <h3>Level 5</h3>
                <a href="#" class = "playEngine" id = "5">Play</a>
            </div>
            <div class = "level">
                <h3>Level 6</h3>
                <a href="#" class = "playEngine" id = "6">Play</a>
            </div>
            <div class = "level">
                <h3>Level 7</h3>
                <a href="#" class = "playEngine" id = "7">Play</a>
            </div>
        </div>
    </div>

    <div class = "multiplayer-level-cards">

        <div class = "game-type-description">
            <img src="/Images/logo/multiplayer.jpg" alt="Multiplayer Img" class = "multiplayer-img">
            <h2>Online Multiplayer</h2>
        </div>

        <div class = "multiplayer-modes">

            <ul class = "online-modes">
                <li class = "GameMode blitz"><a href="#">Blitz: 1 min</a></li>
                <li class = "GameMode bullet"><a href="#">Bullet: 3 min</a></li>
                <li class = "GameMode classic"><a href="#">Classic: 10 min</a></li>
            </ul>
        </div>
    </div>
</div>

<!-- Custom Dialog for Finding Players in Multiplayer Matches -->
<div id="matching-player-dialog" class="custom-dialog">
  <div class="dialog-content">
    <span class="close-button" id="closeButtonMulti">&times;</span>
    <h2>Finding Players</h2>
    <img src="/Images/logo/finding.gif" alt="Finding Gif">
  </div>
</div>


<!-- Custom Alert Dialog for color selection -->
<div id="customAlert" class="custom-alert">
  <div class="custom-alert-content">
    <span class="close-button" id="closeButtonEngine">&times;</span>
    <p>Choose your color:</p>
    <img src="/Images/white_pieces/K.png" alt="white-king" id="whiteButton">
    <img src="/Images/black_pieces/k.png" alt="black-king" id="blackButton">
  </div>
</div>