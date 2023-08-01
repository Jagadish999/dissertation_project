<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finding Player</title>
</head>
<body>
    @csrf
    <h1>Finding Player</h1>

    <script src = "{{ asset('build/assets/app-8ded3b4b.js') }}"></script>
    <script>
        const channelName = "{{$data['channelName']}}";


        Echo.channel(channelName).listen('MatchMaker', (e) => {
            const url = "{{ route('playerFound')}}";
            location.href = url;
        });
        
    </script>
    
</body>
</html>