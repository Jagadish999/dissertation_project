<div class = "edit-main-container">

    <section>
        <header>
            <h2>Profile Information</h2>
            <p>Update your account's profile information and email address.</p>
        </header>

        <form method="post" action="{{ route('profile.update') }}">
            @csrf
            @method('patch')

            <div>
                <label for="name">Name</label>
                <input id="name" name="name" type="text" required value="{{ old('name', $user->name) }}" autofocus autocomplete="name">
                @error('name')
                    <div class="error-message">{{ $message }}</div>
                @enderror
            </div>

            <div>
                <label for="email">Email</label>
                <input id="email" name="email" type="email" required value="{{ old('email', $user->email) }}" autocomplete="username">
                @error('email')
                    <div class="error-message">{{ $message }}</div>
                @enderror

                @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                    <div>
                        <p>Your email address is unverified.</p>
                        <button form="send-verification">Click here to re-send the verification email.</button>

                        @if (session('status') === 'verification-link-sent')
                            <p>A new verification link has been sent to your email address.</p>
                        @endif
                    </div>
                @endif
            </div>

            <div>
                <button type="submit">Save</button>
            </div>

            @if (session('status') === 'profile-updated')
                <div class="success-message">Saved.</div>
            @endif
        </form>
    </section>

    <section>

        <header>
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ __('Update Password') }}
            </h2>

            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ __("Ensure your account is using a long, random password to stay secure.") }}
            </p>
        </header>

        <form method="post" action="{{ route('password.update') }}" class="mt-6 space-y-6">
            @csrf
            @method('put')

            <div>
                <label for="current_password">{{ __('Current Password') }}</label>
                <input id="current_password" name="current_password" type="password" class="mt-1 block w-full" autocomplete="current-password" />
                <div class="error-message">{{ $errors->updatePassword->first('current_password') }}</div>
            </div>

            <div>
                <label for="password">{{ __('New Password') }}</label>
                <input id="password" name="password" type="password" class="mt-1 block w-full" autocomplete="new-password" />
                <div class="error-message">{{ $errors->updatePassword->first('password') }}</div>
            </div>

            <div>
                <label for="password_confirmation">{{ __('Confirm Password') }}</label>
                <input id="password_confirmation" name="password_confirmation" type="password" class="mt-1 block w-full" autocomplete="new-password" />
                <div class="error-message">{{ $errors->updatePassword->first('password_confirmation') }}</div>
            </div>

            <div class="flex items-center gap-4">
                <button type="submit">{{ __('Save') }}</button>

                @if (session('status') === 'password-updated')
                    <p
                        x-data="{ show: true }"
                        x-show="show"
                        x-transition
                        x-init="setTimeout(() => show = false, 2000)"
                        class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ __('Saved.') }}</p>
                @endif
            </div>
        </form>
    </section>

    <section>
        <h2>Add Image</h2>
        <form action="{{ route('image.upload') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="file" name="image" accept="image/*"  required = "required">
            <button type="submit">Upload Image</button>
        </form>
    </section>
</div>