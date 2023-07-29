<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel = "stylesheet" type = "text/css" href = "/css/main.css">
</head>
<body>

    <div class = "main-container">

        <div class = "side-nav">
            <nav>
                <li><a href="dashboard">dashboard</a></li>
                <li><a href="multiplayer">Multiplayer</a></li>
                <li><a href="logout">Log Out</a></li>
            </nav>
        </div>

        <div class = "content">
            <h1>This is dashboard</h1><br>

            <h1>Id: {{$data['Id']}}</h1>
            <h1>Your Name: {{$data['Fullname']}}</h1>
            <h1>Your Email: {{$data['Email']}}</h1>
            <h1>Your Role: {{$data['Role']}}</h1>
            <h1>Blitz Rating: {{$data['blitz']}}</h1>
            <h1>Bullet Rating: {{$data['bullet']}}</h1>
            <h1>Classic Rating: {{$data['classic']}}</h1>

        </div>

    </div>
    
</body>
</html>