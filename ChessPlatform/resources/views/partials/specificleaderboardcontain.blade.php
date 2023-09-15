<div class = "main-leaderboard-view">

    <div class="category">

        <h2 class="leaderboard-title">{{$title}}</h2>
        
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
                @foreach ($topPlayerInfos as $index => $player)
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