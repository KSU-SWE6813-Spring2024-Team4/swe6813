import { Alert as MaterialAlert } from '@mui/material';

export default function Alert({ children, ...props }) {
  return (
    <MaterialAlert { ...props } sx={{ position: 'absolute', top: 88, right: 16, width: '20vw' }}>
      { children }
    </MaterialAlert>
  );
}