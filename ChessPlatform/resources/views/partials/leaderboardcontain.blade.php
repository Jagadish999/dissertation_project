<div class = "main-leaderboard-view">

    <div class="category">
        <div class = "heading-and-btn">
            <h2 class="leaderboard-title">Blitz Leaderboard</h2>
            <a href="/play/leaderboard/blitz">
                <i class="fas fa-stopwatch"></i>
                Blitz Leaderboard
            </a>
        </div>
        
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th class="rank-column">Rank</th>
                    <th class="name-column">Name</th>
                    <th class="games-played-column">Total Games Played</th>
                    <th class="image-column">Image</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['blitz'] as $index => $player)
                <tr>
                    <td>#{{ $index + 1 }}</td>
                    <td>{{ $player['name'] }}</td>
                    <td>{{ $player['totalGamesPlayed'] }}</td>
                    <td>
                        <img src="/Images/Profile/{{ $player['image'] }}" alt="{{ $player['name'] }}" class="profile-image">
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

        <div class="category">
            <div class = "heading-and-btn">
                <h2 class="leaderboard-title">Bullet Leaderboard</h2>
                <a href="/play/leaderboard/bullet">
                    <i class="fas fa-fast-forward"></i>
                    Bullet Leaderboard
                </a>
            </div>

            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th class="rank-column">Rank</th>
                        <th class="name-column">Name</th>
                        <th class="games-played-column">Total Games Played</th>
                        <th class="image-column">Image</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['bullet'] as $index => $player)
                    <tr>
                        <td>#{{ $index + 1 }}</td>
                        <td>{{ $player['name'] }}</td>
                        <td>{{ $player['totalGamesPlayed'] }}</td>
                        <td>
                            <img src="/Images/Profile/{{ $player['image'] }}" alt="{{ $player['name'] }}" class="profile-image">
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

        </div>

        <div class="category">
            <div class = "heading-and-btn">
                <h2 class="leaderboard-title">Classic Leaderboard</h2>
                <a href = "/play/leaderboard/classic">
                    <i class="fas fa-chess-king"></i>
                    Classic Leaderboard
                </a>
            </div>
            
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th class="rank-column">Rank</th>
                        <th class="name-column">Name</th>
                        <th class="games-played-column">Total Games Played</th>
                        <th class="image-column">Image</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['classic'] as $index => $player)
                    <tr>
                        <td>#{{ $index + 1 }}</td>
                        <td>{{ $player['name'] }}</td>
                        <td>{{ $player['totalGamesPlayed'] }}</td>
                        <td>
                            <img src="/Images/Profile/{{ $player['image'] }}" alt="{{ $player['name'] }}" class="profile-image">
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

        </div>
    </div>

</div>