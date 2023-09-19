<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <link rel="stylesheet" href="/css/dashboard/style.css">
    <link rel="stylesheet" href="/css/leaderboard/leaderboard.css">
    
    
    <title>{{$title}}</title> 
</head>
<body>

    @include('partials.navigation')
    @include('partials.leaderboardcontain')


    <script src = "/js/dashboard/script.js"></script>

    <script>
        const data = @json($data);
    </script>

</body>
</html>