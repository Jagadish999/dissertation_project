<div class = "analysis-main-container">

    <div class = "online-Matches">

        <h1>Recent Online Matches</h1>

        @forelse($allOnlineMatchdata as $eachMatch)
        <div class = "match-details">

            <div class = "fenPos">

            </div>

            <div class = "playerDetails">
                <div class = "playerWhite">
                    <img src="/Images/Profile/{{$eachMatch['whitePlayerImage']}}" alt="">
                    <h2>{{ $eachMatch['whitePlayerName'] }}</h2>
                </div>
                <div class = "playerBlack">
                    <img src="/Images/Profile/{{$eachMatch['blackPlayerImage']}}" alt="">
                    <h2>{{ $eachMatch['blackPlayerName'] }}</h2>
                </div>
            </div>

            <div class = "matchDetails">
                <p>Number of Moves: {{ $eachMatch['totalNumberOfMoves'] }}</p>
                <p>Game Type: {{ $eachMatch['gameType'] }}</p>
            </div>

            <div class = "button">
                <a href="/analysis/{{ $eachMatch['gameType'] }}/{{ $eachMatch['matchId'] }}">
                    <i class="fas fa-search"></i>
                    Analysis
                </a>
            </div>

        </div>
        @empty
            <h2>No online matches found</h2>
        @endforelse



        <h1>Recent Engine Matches</h1>

        @forelse($allEngineMatches as $eachMatch)
        <div class = "match-details">

            <div class = "fenPosEngine">

            </div>

            <div class = "playerDetails">
                <div class = "playerWhite">
                    <img src="/Images/Profile/{{$eachMatch['playerImage']}}" alt="">
                    <h2>{{ $eachMatch['playerName'] }}</h2>
                </div>
                <div class = "playerBlack">
                    <img src="/Images/Profile/stockfish.png" alt="">
                    <h2>Stockfish</h2>
                </div>
            </div>

            <div class = "matchDetails">
                <p>Number of Moves: {{ $eachMatch['totalNumberOfMoves'] }}</p>
                <p>Game Type: {{ $eachMatch['gameType'] }}</p>
            </div>

            <div class = "button">
                <a href="/analysis/{{ $eachMatch['gameType'] }}/{{ $eachMatch['matchId'] }}">
                    <i class="fas fa-search"></i>
                    Analysis
                </a>

                @if($eachMatch['continuable'] == true)

                <a href="/engineground/{{ $eachMatch['matchId'] }}" class = "continue">
                    <i class="fas fa-arrow-right"></i>
                    Continue
                </a>

                @endif
            </div>

        </div>
        @empty
            <h2>No Engine matches found</h2>
        @endforelse


    </div>

    <div class = "engine-Matches">

    </div>
    
</div>