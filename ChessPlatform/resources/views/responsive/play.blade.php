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
    <link rel="stylesheet" href="/css/play/play.css">
    
    <script src = "{{asset('build/assets/app-4212186a.js')}}"></script>
    <script src = "/js/play/play.js"></script>
    <script src = "/js/PostRequest/GetOrPostRequest.js"></script>
    
    <title>Play</title> 
</head>
<body>

    @include('partials.navigation')
    @include('partials.playcontain')

    <script src = "/js/dashboard/script.js"></script>
    

    <script>
        const userInfos = @json($userDetails);
        console.log(userInfos);
    </script>

</body>
</html>