import { Button, TextField } from '@mui/material';
import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            id="username"
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            id="password"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="login-button"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
