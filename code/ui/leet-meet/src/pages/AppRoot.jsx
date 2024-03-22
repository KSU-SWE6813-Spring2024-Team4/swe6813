import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function AppRoot() {
  return (
    <Stack>
      <Outlet />
    </Stack>
  )
}
