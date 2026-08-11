function Login() {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">
          SmartFlow
        </div>

        <p className="section-label">
          WELCOME BACK
        </p>

        <h1>Sign in</h1>

        <p className="login-description">
          Continue managing your day and reaching your goals.
        </p>

        <form>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Sign in
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;