import { Button, Container, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useContext, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Action, store } from '../store';

const columns = [
  { field: 'id' },
  { field: 'username', headerName: 'Username', width: 250 },
  { field: 'type', headerName: 'Type' }
]

export default function GamePage() {
  const { game, ratings } = useLoaderData();
  const { dispatch, state } = useContext(store);
  const navigate = useNavigate();

  const followers = useMemo(() => {
    if (!game) {
      return [];
    }

    return state.gameFollowers[game.id].map((userId) => ({ ...state.users[userId] }));
  }, [game, state.gameFollowers, state.users])

  const isFollowing = useMemo(() => {
    return followers.find((follower) => follower.id === state.user?.id)
  }, [followers, state.user])

  const onFollow = useCallback(() => {
    dispatch({ type: Action.FollowGame, payload: { gameId: game.id, userId: state.user?.id } })
  }, [dispatch, game, state.user]);

  const onUnfollow = useCallback(() => {
    dispatch({ type: Action.UnfollowGame, payload: { gameId: game.id, userId: state.user?.id } })
  }, [dispatch, game, state.user]);

  const onClick = useCallback(({ row }) => {
    navigate(`/users/${row.id}`)
  }, [navigate])

  return (
    <Stack>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography>{ game?.title ?? '' }</Typography>
        { state.user && !isFollowing && <Button onClick={onFollow}>Follow</Button> }
        { state.user && isFollowing && <Button onClick={onUnfollow}>Unfollow</Button> }
      </Container>
      <DataGrid columnVisibilityModel={{ id: false }} columns={ columns } onRowClick={ onClick } rows={ followers } slots={{ toolbar: () => <Typography>Followers</Typography> }}/>
    </Stack>
  )
}
