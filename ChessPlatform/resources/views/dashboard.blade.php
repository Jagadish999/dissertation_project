<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
    <link rel = "stylesheet" type = "text/css" href = "/css/dashboard.css">
</head>
<body>

    <div class = "main-container">

    <div class = "side-nav">
        <nav>
            <li><a href="dashboard" class = "dashboard-nav-list">Dashboard</a></li>
            <li><a href="play" class = "play-nav-list">Play</a></li>
            <li><a href="profile">Profile</a></li>
            <li><a href="#">Puzzles</a></li>
            <li><a href="#">Leaderboard</a></li>
            <li><a href="#">Analysis</a></li>
            <li><a href="#">Log Out</a></li>
        </nav>
    </div>

        <div class = "content">

            <div class = "player-personal-info">
                <img src="/Images/dummy/dummy-male.jpg" alt="Player Img">

                <div class = "player-name-email">
                    <h1>Name: {{$data['fullname']}}</h1>
                    <h1>Email: {{$data['email']}}</h1>
                </div>

            </div>

            <div class = "player-ratings">

                <h1>Ratings</h1>

                <div class = "all-rating">
                    <div class = "blitz-rating">
                        <span>{{$data['blitz']}}</span>
                        <img src="/Images/rating/lightning.png" alt="blitz-img">
                        <span>Blitz</span>
                    </div>

                    <div class = "bullet-rating">
                        <span>{{$data['bullet']}}</span>
                        <img src="/Images/rating/bullet.png" alt="blitz-img">
                        <span>Bullet</span>
                    </div>

                    <div class = "classic-rating">
                        <span>{{$data['classic']}}</span>
                        <img src="/Images/rating/clock.png" alt="blitz-img">
                        <span>Classic</span>
                    </div>
                </div>

            </div>

        </div>

    </div>
    
</body>
</html>