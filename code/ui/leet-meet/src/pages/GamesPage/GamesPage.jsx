import {
  Paper,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  useCallback,
  useMemo
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store';

const columns = [
  { 
    field: 'title',
    headerName: 'Title',
    width: 200
  },
  {
    field: 'followerCount',
    headerName: 'Followers'
  }
]

export default function GamesPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const games = useMemo(() => state.games.map((game) => ({ 
    ...game, 
    followerCount: state.gameFollowers[game.id].length 
  })), [state.games, state.gameFollowers]);

  const onClick = useCallback(({ row }) => {
    navigate(`/games/${row.id}`)
  }, [navigate])

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2 }}
    >
      <DataGrid
        columns={ columns }
        onRowClick={ onClick }
        rows={ games }
        slots={{ toolbar: () => <Typography sx={{ margin: 1 }} variant="h3">Games</Typography> }}
      />
    </Paper>
  )
}
