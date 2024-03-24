import { Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Action, store } from '../store';
import mocks from '../mocks';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch } = useContext(store);
  const navigate = useNavigate();
  

  const onSignIn = useCallback(() => {
    if (username.length === 0 || password.length === 0) {
      return;
    }

    dispatch({ type: Action.LoginUser, payload: { id: Object.keys(mocks.users).length + 1, username } })
    navigate('/games')
  }, [dispatch, navigate, password, username])

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Stack>
          <TextField
            label="Username"
            onChange={({ target }) => setUsername(target.value)}
            required 
            value={username} 
          />
          <TextField
            label="Password"
            onChange={({ target }) => setPassword(target.value)}
            required
            value={password} 
          />
          <Button onClick={onSignIn} variant="contained">Sign In</Button> 
          <Typography>Don't have an account? <Link href="/register">Create one here</Link></Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
