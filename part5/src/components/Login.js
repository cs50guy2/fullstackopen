function Login({
  username,
  password,
  changeUsername,
  changePassword,
  submitForm,
}) {
  return (
    <form onSubmit={submitForm}>
      <div>
        username:{' '}
        <input
          id="username"
          type="text"
          value={username}
          onChange={changeUsername}
        />
      </div>
      <div>
        password:{' '}
        <input
          id="password"
          type="password"
          value={password}
          onChange={changePassword}
        />
      </div>
      <div>
        <button id="login-button" type="submit">
          login
        </button>
      </div>
    </form>
  );
}

export default Login;
