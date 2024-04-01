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
  useContext,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert/Alert';
import mocks from '../../mocks';
import {
  Action,
  store
} from '../../store';
import { login } from '../../util/Api/AuthApi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { dispatch } = useContext(store);
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

      setIsSuccess(true);
      navigate('/games')
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [dispatch, navigate, password, username, setIsSuccess])

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 2 }}
      >
        <Stack>
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
            value={password} 
          />
          <Button
            data-testid="loginButton"
            onClick={onSignIn}
            variant="contained"
          >
            Sign In
          </Button> 
          <Typography>
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
      {isSuccess && (
        <Alert
          elevation={3} 
          severity="success"
        >
          Logging in!
        </Alert>
      )}
    </Container>
  )
}
