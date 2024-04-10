import { 
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  useCallback,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert/Alert';
import {
  Action,
  useAppContext
} from '../../store';
import { login } from '../../util/Api/AuthApi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  const onSignIn = useCallback(async () => {
    if (username.length === 0 || password.length === 0) {
      setErrorMessage('All fields must be filled!')
      return;
    }

    try {
      const user = await login({ username, password });
    
      dispatch({ 
        type: Action.LoginUser, 
        payload: user
      })

      navigate('/games')
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [dispatch, navigate, password, username])

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #009688, #FFFFFF)',
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 2, width: { xs: '90%', sm: '70%', md: '50%' } }}
      >
        <Stack spacing={2}>
          <Typography variant="h4" align="center">Sign In</Typography>
          <TextField
            onChange={({ target }) => setUsername(target.value)}
            placeholder="Username"
            required 
            value={username}
          />
          <TextField
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            required
            type="password"
            value={password} 
          />
          <Button
            data-testid="loginButton"
            onClick={onSignIn}
            variant="contained"
          >
            Sign In
          </Button> 
          <Typography align="center">
            Don't have an account?&nbsp;
            <Link href="/register">Create one here</Link>
          </Typography>
        </Stack>
      </Paper>
      {errorMessage && (
        <Alert
          elevation={3} 
          severity="error"
        >
          {errorMessage}
        </Alert>
      )}
    </Container>
  )
}
