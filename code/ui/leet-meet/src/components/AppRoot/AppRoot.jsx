import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  Container, 
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography 
} from '@mui/material';
import { 
  useCallback,
  useState
} from 'react';
import {
  Outlet,
  useNavigate
} from 'react-router-dom';
import { useAppContext } from '../../store';

export default function AppRoot() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { state } = useAppContext();


  const handleMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const onExplore = useCallback(() => {
    navigate('/games')
  }, [navigate]);

  const onProfile = useCallback(() => {
    navigate(`/users/${state.user.id}`)
  }, [navigate, state.user])

  const onAuth = useCallback(() => {
    handleClose()
    navigate('/login')
  }, [handleClose, navigate])

  return (
    <Stack>
      <AppBar>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row">
            <MenuItem
              key="explore" 
              onClick={onExplore}
            >
              <Typography textAlign="center">Explore</Typography>
            </MenuItem>
            { state.user && (
              <MenuItem
                key="profile" 
                onClick={onProfile}
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
            ) }
          </Stack>
          <div>
            { state.user ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                  <Typography marginLeft={1}>{state.user?.username ?? '' }</Typography>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={onAuth}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <MenuItem
                key="sign-in"
                onClick={ onAuth }
              >
                <Typography textAlign="center">Sign In</Typography>
              </MenuItem>
            ) }
          </div>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 12, marginBottom: 12 }}>
        <Outlet />
      </Container>
    </Stack>
  )
}
