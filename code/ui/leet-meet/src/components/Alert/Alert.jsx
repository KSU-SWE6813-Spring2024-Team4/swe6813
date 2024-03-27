import { Alert as MaterialAlert } from '@mui/material';

export default function Alert({ children, ...props }) {
  return (
    <MaterialAlert { ...props } sx={{ position: 'absolute', top: 16, right: 16, width: '20vw' }}>
      { children }
    </MaterialAlert>
  );
}