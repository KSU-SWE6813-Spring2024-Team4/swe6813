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
import { register } from '../../util/Api/AuthApi';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  const onUsernameChange = useCallback(({ target }) => {
    setUsername(target.value);
  }, [setUsername]);

  const onPasswordChange = useCallback(({ target }) => {
    setPassword(target.value);
  }, [setPassword]);

  const onConfirmPasswordChange = useCallback(({ target }) => {
    setConfirmPassword(target.value);
  }, [setConfirmPassword]);

  const onRegister = useCallback(async () => {
    const hasEmptyFields = username.length === 0 || password.length === 0 || confirmPassword.length === 0
    if (hasEmptyFields) {
      setErrorMessage('All fields must be filled!')
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!')
      return;
    }


    try {
      const user = await register({ username, password });

      dispatch({ 
        type: Action.LoginUser, 
        payload: user
      });

      navigate('/games');
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [username, password, confirmPassword, navigate, dispatch, setErrorMessage]);

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
          <Typography variant="h4" align="center">Register</Typography>
          <TextField
            onChange={onUsernameChange}
            placeholder="Username"
            required
            fullWidth
          />
          <TextField
            onChange={onPasswordChange}
            placeholder="Password"
            required
            type="password"
            fullWidth
          />
          <TextField
            onChange={onConfirmPasswordChange}
            placeholder="Confirm Password"
            required
            type="password"
            fullWidth
          />
          <Button
            data-testid="registerButton"
            onClick={onRegister}
            variant="contained"
            color="info"
            fullWidth
          >
            Register
          </Button>
          <Typography align="center">
            Already have an account?&nbsp;
            <Link href="/login">Sign In</Link>
          </Typography>
        </Stack>
      </Paper>
      {errorMessage && (
        <Alert
          elevation={3}
          severity="error"
          sx={{ marginTop: 2 }}
        >
          {errorMessage}
        </Alert>
      )}
    </Container>
  )
}
