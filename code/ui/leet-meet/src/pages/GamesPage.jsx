import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../store';

const columns = [
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'followerCount', headerName: 'Followers' }
]

export default function GamesPage() {
  const { state } = useContext(store);
  const navigate = useNavigate();

  const games = useMemo(() => {
    return state.games.map((game) => ({ ...game, followerCount: state.gameFollowers[game.id].length }))
  }, [state.games, state.gameFollowers]);

  const onClick = useCallback(({ row }) => {
    navigate(`/games/${row.id}`)
  }, [navigate])

  return (
    <DataGrid columns={ columns } onRowClick={ onClick } rows={ games } />
  )
}