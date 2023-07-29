<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel = "stylesheet" type = "text/css" href = "/css/form.css">
</head>
<body>

    <div class = "main-registration-form">

        <div class = "form-heading">
            <h1>Login Account</h1>
        </div>

        <div class = "form">
            <form action="{{route('user-logged')}}" method = "post">

                @if(Session::has('FAIL'))
                <div class = "form-message">
                    <span class = "error-message">{{Session::get('FAIL')}}</span>
                </div>
                @endif
                
                @csrf
                <div class = "form-input-group">
                    <input name = "email" type="email" placeholder = "Enter Your Email" class = "inputs">
                </div>

                <div class = "form-message">
                    <span class = "error-message">@error('email') {{$message}} @enderror</span>
                </div>

                <div class = "form-input-group">
                    <input name = "password" type="password" placeholder = "Enter Your Password" class = "inputs">
                </div>

                <div class = "form-message">
                    <span class = "error-message">@error('password') {{$message}} @enderror</span>
                </div>

                <div class = "form-input-group">
                    <input type="submit" value = "Log In" class = "submit"> 
                </div>

            </form>
        </div>

        <div class = "form-login">
            <p>New to ChessGaming? <a href="/register">Register Here</a></p>
        </div>
    
    </div>
</body>
</html>