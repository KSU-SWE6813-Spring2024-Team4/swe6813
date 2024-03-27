import { Alert as _Alert } from '@mui/material';

export default function Alert({ children, ...props }) {
  return (
    <_Alert { ...props } sx={{ position: 'absolute', top: 16, right: 16, width: '20vw' }}>
      { children }
    </_Alert>
  );
}