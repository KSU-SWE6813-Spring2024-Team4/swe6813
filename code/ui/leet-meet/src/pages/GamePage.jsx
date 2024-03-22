import { Button, Container, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useContext, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { store } from '../store';

const columns = [
  { field: 'username', headerName: 'Username' },
  { field: 'type', headerName: 'Type' }
]

export default function GamePage() {
  const { game, ratings } = useLoaderData();
  const { state } = useContext(store);
  const navigate = useNavigate();

  console.log({ ratings })

  const followers = useMemo(() => {
    if (!game) {
      return [];
    }

    return state.gameFollowers[game.id].map((userId) => ({ ...state.users[userId] }));
  }, [game, state.gameFollowers, state.users])

  const onClick = useCallback(({ row }) => {
  }, [])

  return (
    <Stack>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography>{ game?.title ?? '' }</Typography>
        <Button>Follow</Button>
      </Container>
      <DataGrid columns={ columns } onRowClick={ onClick } rows={ followers } slots={{ toolbar: () => <Typography>Followers</Typography> }}/>
    </Stack>
  )
}
