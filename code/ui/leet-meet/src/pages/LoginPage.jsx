import { Button, Container, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({}) {
  const navigate = useNavigate();

  return (
    <Container>
      <Stack>
        <TextField label="Email Address" required/>
        <TextField label="Password" required/>
        <Button onClick={() => navigate('/games')} variant="contained">Sign In</Button> 
      </Stack>
    </Container>
  )
}
