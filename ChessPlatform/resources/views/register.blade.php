<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel = "stylesheet" type = "text/css" href = "/css/form.css">
</head>
<body>

    <div class = "main-registration-form">

        <div class = "form-heading">
            <h1>Create Account</h1>
        </div>

        <div class = "form">
            <form action="{{ route('user-registered') }}" method = "post">

                @if(Session::has('FAIL'))
                <div class = "form-message">
                    <span class = "error-message">{{Session::get('FAIL')}}</span>
                </div>
                @endif

                @csrf
                <div class = "form-input-group">
                    <input name = "name" type="text" placeholder = "Enter Your Full Name" class = "inputs" value = "{{old('name')}}">
                </div>

                <div class = "form-message">
                    <span class = "error-message">@error('name') {{$message}} @enderror</span>
                </div>

                <div class = "form-input-group">
                    <input name = "email" type="email" placeholder = "Enter Your Email" class = "inputs" value = "{{old('email')}}">
                </div>

                <div class = "form-message">
                    <span class = "error-message">@error('email') {{$message}} @enderror</span>
                </div>

                <div class = "form-input-group">
                    <input name = "password" type="password" placeholder = "Enter Your Password" class = "inputs" value = "{{old('password')}}">
                </div>

                <div class = "form-message">
                    <span class = "error-message">@error('password') {{$message}} @enderror</span>
                </div>

                <div class = "form-input-group">
                    <input type="submit" value = "SIGN UP" class = "submit"> 
                </div>

            </form>
        </div>

        <div class = "form-login">
            <p>Have already an account? <a href="/login">Login Here</a></p>
        </div>
        

    </div>
</body>
</html>