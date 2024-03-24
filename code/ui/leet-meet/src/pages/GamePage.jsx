import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useContext, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Action, store } from '../store';
import { getRatingCounts, getTopRatingsForUser } from '../util/Calculator';
import { ATTRIBUTES, SKILLS } from '../util/Constants';

const columns = [
  { field: 'id' },
  { field: 'username', headerName: 'Username', width: 250 },
  { field: 'attribute', headerName: 'Attribute' },
  { field: 'skill', headerName: 'Skill' }
]

export default function GamePage() {
  const { game } = useLoaderData();
  const { dispatch, state } = useContext(store);
  const navigate = useNavigate();

  const topRatingsByUser = useMemo(() => {
    if (!game) {
      return {};
    }

    const ratingsByUser = Object.keys(state.ratings[game.id]).reduce((acc, userId) => {
      if (!acc[userId]) {
        acc[userId] = { attribute: [], skill: [] };
      }
        
      acc[userId]['attribute'] = [...acc[userId]['attribute'], ...state.ratings[game.id][userId].attribute];
      acc[userId]['skill'] = [...acc[userId]['skill'], ...state.ratings[game.id][userId].skill];
      return acc;
    }, {})

    return Object.keys(ratingsByUser).reduce((acc, userId) => {
      acc[userId] = getTopRatingsForUser(ratingsByUser[userId]);
      return acc
    }, {});
  }, [game, state.ratings]);

  const followers = useMemo(() => {
    if (!game) {
      return [];
    }

    return state.gameFollowers[game.id].map((userId) => ({ ...state.users[userId], ...topRatingsByUser[userId] }));
  }, [game, state.gameFollowers, state.users]);

  const ratingsData = useMemo(() => {
    if (!game) {
      return { skill: [], attribute: [] };
    }

    const ratings = Object.values(state.ratings[game?.id]).reduce((acc, userRating) => {
      acc['attribute'] = [...acc['attribute'], ...userRating.attribute]
      acc['skill'] = [...acc['skill'], ...userRating.skill]
      return acc;
    }, { attribute: [], skill: [] });

    const { skill, attribute } = getRatingCounts(ratings);

    return {
      skill: [{ data: SKILLS.map((SKILL) => skill[SKILL]) }],
      attribute: [{ data: ATTRIBUTES.map((ATTRIBUTE) => attribute[ATTRIBUTE]) }]
    }
  }, [game, state.ratings]);

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
      <Stack direction="row" sx={{ display: 'flex', marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ flexGrow: 2, marginRight: 4, padding: 3 }}>
          <Typography>Skill Ratings</Typography>
          <BarChart
            series={ratingsData.skill}
            height={290}
            xAxis={[{ data: SKILLS, scaleType: 'band' }]}
          />
        </Paper>
        <Paper elevation={3} sx={{ flexGrow: 1, padding: 3 }}>
          <Typography>Attribute Ratings</Typography>
          <BarChart
            layout="horizontal"
            series={ratingsData.attribute}
            height={290}
            yAxis={[{ data: ATTRIBUTES, scaleType: 'band' }]}
            margin={{ left: 100 }}
          />
        </Paper>
      </Stack>
      <DataGrid
        columnVisibilityModel={{ id: false }}
        columns={ columns }
        onRowClick={ onClick }
        rows={ followers }
        slots={{ toolbar: () => <Typography>Followers</Typography> }}/>
    </Stack>
  )
}
