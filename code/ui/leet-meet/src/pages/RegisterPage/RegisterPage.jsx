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
import {
  Action,
  store
} from '../../store';
import mocks from '../../mocks';

export default function RegisterPage({}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { dispatch } = useContext(store);
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

  const onRegister = useCallback(() => {
    const hasEmptyFields = username.length === 0 || password.length === 0 || confirmPassword.length === 0
    if (hasEmptyFields) {
      setErrorMessage('All fields must be filled!')
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!')
      return;
    }

    setIsSuccess(true);
    dispatch({
      type: Action.LoginUser,
      payload: { 
        id: Object.keys(mocks.users).length + 1,
        username 
      }
    });
    navigate('/games');
  }, [username, password, confirmPassword, navigate, dispatch, setIsSuccess, setErrorMessage]);

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{ padding: 2 }}
      >
        <Stack>
          <Typography variant="h3">Register</Typography>
          <TextField
            onChange={ onUsernameChange } 
            placeholder="Username"
            required
          />
          <TextField
            onChange={ onPasswordChange } 
            placeholder="Password"
            required
            type="password"
          />
          <TextField
            onChange={ onConfirmPasswordChange }
            placeholder="Confirm Password"
            required
            type="password"
          />
          <Button
            data-testid="registerButton"
            onClick={ onRegister }
          >
            Register
          </Button>
          <Typography>
            Already have an account?&nbsp;
            <Link href="/login">Sign In</Link>
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
          Account created!
        </Alert>
      )}
    </Container>
  )
}
