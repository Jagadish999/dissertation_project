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
            
        </div>

    </div>

    <script src = "{{ asset('build/assets/app-8ded3b4b.js') }}"></script>
    <script>

        console.log('ksnmksaf');

        //channel(channel name) listen(event name)
        Echo.channel('GamePlayChannel').listen('ChessGamePlayApi', (e) => {

            console.log(e);
            console.log("Some messages");

        });

    </script>
    
</body>
</html>