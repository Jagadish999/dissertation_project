<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Play Online</title>

    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">

</head>
<body>

    <div class = "main-container">

        <div class = "side-nav">
            <nav>
                <li><a href="/dashboard" class = "dashboard-nav-list">Dashboard</a></li>
                <li><a href="/play" class = "play-nav-list">Play</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/puzzle">Puzzles</a></li>
                <li><a href="/addpuzzle">Add Puzzles</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
                <li><a href="/analysis">Analysis</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">
            
        </div>

    </div>

    <script>
        console.log(@json($data));
    </script>


</body>
</html>