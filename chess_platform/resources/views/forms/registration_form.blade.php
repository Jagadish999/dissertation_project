@include('includes.header')
<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4" style="margin-top:20px;">
            <h4>Player Registration</h4>
            <hr>
            <form action="{{route('player-registered')}}" method="post">
                @if(Session::has('PASSED_MESSAGE'))
                    <div class="alert alert-success">{{Session::get('PASSED_MESSAGE')}}</div>
                @endif
                @if(Session::has('FAILED_MESSAGE'))
                    <div class="alert alert-danger">{{Session::get('FAILED_MESSAGE')}}</div>
                @endif
                @csrf
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input class = "form-control" type="text"  placeholder = "Enter Full Name" value = "{{old('name')}}" name = "name">
                    <span class="text-danger">@error('name') {{$message}} @enderror</span>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input class = "form-control" type="email"  placeholder = "Enter Your Email" value = "{{old('email')}}" name = "email">
                    <span class="text-danger">@error('email') {{$message}} @enderror</span>
                </div>

                <div class="form-group">
                    <label for="name">Password</label>
                    <input class = "form-control" type="password" placeholder = "Enter Your Password" value = "{{old('password')}}" name = "password">
                    <span class="text-danger">@error('password') {{$message}} @enderror</span>
                </div>
                
                <div class="form-group">
                    <button class="btn btn-block btn-primary" type = "submit">Register</button>
                </div>

                <br>

                <a href="/playerLogin">Login</a>
            </form>
        </div>
    </div>
</div>
@include('includes.footer')