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
  { field: 'id' },
  { 
    field: 'name',
    headerName: 'Name',
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

  const games = useMemo(() => state.games.map((game) => {
    return {
      ...game,
      followerCount: state.gameFollowers[game.id]?.length 
    }
  }), [state.games, state.gameFollowers]);

  const onClick = useCallback(({ row }) => {
    navigate(`/games/${row.id}`)
  }, [navigate])

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #009688, #FFFFFF)',
        minHeight: '100vh', // Ensure the background covers the entire viewport height
        padding: '16px', // Adjust padding as needed
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          width: '97%',
        }}
      >
        <Typography sx={{ marginBottom: 2 }} variant="h4">Games</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{ id: false }}
            columns={ columns }
            onRowClick={ onClick }
            rows={ games }
            pageSize={5}
          />
        </div>
      </Paper>
    </div>
  )
}
