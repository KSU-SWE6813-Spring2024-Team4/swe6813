import { Button, Container, Stack, TextField } from '@mui/material';

export default function RegisterPage({}) {
  return (
    <Container>
      <Stack>
        <TextField label="Email Address" required/>
        <TextField label="Password" required/>
      </Stack>
    </Container>
  )
}