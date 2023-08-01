<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess Live Match</title>
</head>
<body>

    <h1>You Will be playing Match Here</h1>

    <script src = "{{ asset('build/assets/app-8ded3b4b.js') }}"></script>
    <script>
        const channelName = "{{$data['channelName']}}";
        console.log(channelName);

        Echo.channel(channelName).listen('ChessGamePlayApi', (e) => {

            console.log(channelName);
            console.log("Game Will Soon Start");
        });
        
    </script>
    
</body>
</html>