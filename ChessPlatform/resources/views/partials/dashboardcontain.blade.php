<div class = "dashboard-main-container">

    <h1 class = "dashboard-heading">Player Dashboard</h1>

    <div class = "card-wrapper">
        <div class="profile-card">

            <div class="image-pro">
                <img src="/Images/Profile/{{ $data['image'] }}" alt="" class="profile-pic">
            </div>

            <div class="data">
                <h2>{{ $data['fullname'] }}</h2>
                <span>Chess Enthusiast</span>
            </div>

            <div class="row">
                <div class="info">
                    <h3>Total Games played</h3>
                    <span>{{ $data['totalMatchesPlayed'] }}</span>
                </div>

                <div class="info">
                    <h3>Total Puzzle Solved</h3>
                    <span>{{ $data['totalPuzzlesSolved'] }}</span>
                </div>

            </div>
        </div>

        <div class="player-ratings">
            <h1>Ratings</h1>
            <div class="all-rating">
                <div class="blitz-rating">
                    <span>{{$data['blitz']}}</span>
                    <img src="/Images/rating/lightning.png" alt="blitz-img">
                    <span>Blitz</span>
                    <p>Total Matches Played: {{ $data['totalBlitzMatches'] }}</p>
                </div>
                <div class="bullet-rating">
                    <span>{{$data['bullet']}}</span>
                    <img src="/Images/rating/bullet.png" alt="bullet-img">
                    <span>Bullet</span>
                    <p>Total Matches Played: {{ $data['totalBulletMatches'] }}</p>
                </div>
                <div class="classic-rating">
                    <span>{{$data['classic']}}</span>
                    <img src="/Images/rating/clock.png" alt="classic-img">
                    <span>Classic</span>
                    <p>Total Matches Played: {{ $data['totalClassicMatches'] }}</p>
                </div>
            </div>
        </div>
    </div>


</div>
