import { 
  Container, 
  Paper, 
  Stack, 
  Typography
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { DataGrid } from '@mui/x-data-grid';
import { 
  useCallback, 
  useContext, 
  useMemo 
} from 'react';
import { 
  useLoaderData, 
  useNavigate 
} from 'react-router-dom';
import { 
  Action, 
  store 
} from '../store';
import { 
  getOrdinal, 
  getRatingCounts, 
  getTopRatingsForUser 
} from '../util/Calculator';
import { 
  ATTRIBUTES, 
  SKILLS 
} from '../util/Constants';
import FollowButton from '../components/FollowButton';

const columns = [
  { field: 'id' },
  { 
    field: 'username', 
    headerName: 'Username', 
    width: 250 
  },
  { 
    field: 'attribute', 
    headerName: 'Attribute' 
  },
  { 
    field: 'skill', 
    headerName: 'Skill' 
  }
]

export default function GamePage() {
  const { game } = useLoaderData();
  const { 
    dispatch, 
    state 
  } = useContext(store);
  const navigate = useNavigate();

  const topRatingsByUser = useMemo(() => {
    if (!game) {
      return {};
    }

    const ratingsByUser = Object.keys(state.ratings[game.id]).reduce((acc, userId) => {
      if (!acc[userId]) {
        acc[userId] = { attribute: [], skill: [] };
      }

      const { attribute, skill } = state.ratings[game.id][userId];
        
      acc[userId]['attribute'] = [...acc[userId]['attribute'], ...attribute];
      acc[userId]['skill'] = [...acc[userId]['skill'], ...skill];
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

  const gameRank = useMemo(
    () => Object.keys(state.gameFollowers)
      .sort((a, b) => state.gameFollowers[a].length < state.gameFollowers[b].length)
      .findIndex((gameId) => gameId === `${game?.id}`) + 1, 
    [state.gameFollowers, game]
  );

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
        <Typography variant="h3">{ game?.title ?? '' }</Typography>
        { state.user && (
          <FollowButton 
            isFollowing={isFollowing} 
            onClick={isFollowing ? onUnfollow : onFollow} 
          />
        ) }
      </Container>
      <Paper
        elevation={3}
        sx={{ display: 'flex', marginTop: 4, marginBottom: 4, padding: 2, justifyContent: 'space-evenly' }}
      >
        <Typography>
          Total Follows: {game ? state.gameFollowers[game.id].length : 0}
        </Typography>
        <Typography>
          Current Rank: {gameRank}{getOrdinal(gameRank)}
        </Typography>
      </Paper>
      <Stack 
        direction="row" 
        sx={{ display: 'flex', marginTop: 4, marginBottom: 4 }}
      >
        <Paper
          elevation={3} 
          sx={{ flexGrow: 2, marginRight: 4, padding: 3 }}
        >
          <Typography>Skill Ratings</Typography>
          <BarChart
            series={ratingsData.skill}
            height={290}
            xAxis={[{ data: SKILLS, scaleType: 'band' }]}
          />
        </Paper>
        <Paper
          elevation={3} 
          sx={{ flexGrow: 1, padding: 3 }}
        >
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
        slots={{ toolbar: () => <Typography>Followers</Typography> }}
      />
    </Stack>
  )
}
