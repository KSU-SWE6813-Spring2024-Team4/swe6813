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
import {
  Action,
  store
} from '../store';
import mocks from '../mocks';

export default function RegisterPage({}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (hasEmptyFields || password !== confirmPassword) {
      return;
    }

    dispatch({
      type: Action.LoginUser, payload: { id: Object.keys(mocks.users).length + 1, username } });
    navigate('/games');
  }, [username, password, confirmPassword, navigate, dispatch]);

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Stack>
          <Typography variant="h3">Register</Typography>
          <TextField
            label="Email Address"
            onChange={ onUsernameChange } 
            required
          />
          <TextField
            label="Password"
            onChange={ onPasswordChange } required/>
          <TextField label="Confirm Password" onChange={ onConfirmPasswordChange } required/>
          <Button onClick={ onRegister }>Register</Button>
          <Typography>Already have an account? <Link href="/login">Sign In</Link></Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
