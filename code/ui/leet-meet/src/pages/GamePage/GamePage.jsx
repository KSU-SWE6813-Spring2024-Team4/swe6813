import { 
  Box,
  Container, 
  Paper, 
  Stack, 
  Typography
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { DataGrid } from '@mui/x-data-grid';
import { 
  useCallback, 
  useMemo,
  useState
} from 'react';
import { 
  useLoaderData, 
  useNavigate 
} from 'react-router-dom';
import Alert from '../../components/Alert/Alert';
import FollowButton from '../../components/FollowButton/FollowButton';
import { 
  Action, 
  useAppContext
} from '../../store';
import { 
  getOrdinal, 
  getRatingCounts, 
  getTopRatingsForUser 
} from '../../util/Calculator/Calculator';
import { 
  followGame, 
  unfollowGame 
} from '../../util/Api/MainApi';

const columns = [
  { field: 'id' },
  { 
    field: 'name', 
    headerName: 'Name', 
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
  const [errorMessage, setErrorMessage] = useState(null);
  const { game } = useLoaderData();
  const { 
    dispatch, 
    state 
  } = useAppContext();
  const navigate = useNavigate();
  

  const topRatingsByUser = useMemo(() => {
    if (!game || !state.ratings[game.id]) {
      return {};
    }

    const ratingsByUser = Object.keys(state.ratings[game.id]).reduce((acc, userId) => {
      if (!acc[userId]) {
        acc[userId] = { 
          attribute: [], 
          skill: [] 
        };
      }

      state.ratings[game.id][userId].forEach((rating) => {
        acc[userId].attribute.push(rating.attribute_id);
        acc[userId].skill.push(rating.skill_id);
      })

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

    return state.gameFollowers[game.id].map((userId) => { 
      return {
        ...state.users[userId], 
        skill: state.skills[topRatingsByUser[userId]?.skill]?.name,
        attribute: state.attributes[topRatingsByUser[userId]?.attribute]?.name
      };
    });
  }, [game, state.gameFollowers, state.users, topRatingsByUser, state.attributes, state.skills]);

  const ratingsData = useMemo(() => {
    if (!game || !state.ratings[game?.id]) {
      return { 
        skill: [], 
        attribute: [] 
      };
    }

    const ratings = Object.values(state.ratings[game?.id]).reduce((acc, userRatings) => {
      userRatings.forEach((rating) => {
        acc.attribute.push(rating.attribute_id);
        acc.skill.push(rating.skill_id);
      });
      return acc;
    }, { attribute: [], skill: [] });

    const { 
      skill: skillCount, 
      attribute: attributeCount 
    } = getRatingCounts(ratings);

    return {
      skill: [{ 
        data: Object.values(state.skills).map((skill) => skillCount[skill.id]) 
      }],
      attribute: [{ 
        data: Object.values(state.attributes).map((attribute) => attributeCount[attribute.id]) 
      }]
    }
  }, [game, state.ratings, state.attributes, state.skills]);

  const isFollowing = useMemo(() => {
    return followers.find((follower) => `${follower.id}` === `${state.user?.id}`)
  }, [followers, state.user])

  const gameRank = useMemo(
    () => Object.keys(state.gameFollowers)
      .sort((a, b) => state.gameFollowers[a].length < state.gameFollowers[b].length)
      .findIndex((gameId) => gameId === `${game?.id}`) + 1, 
    [state.gameFollowers, game]
  );

  const onFollow = useCallback(async () => {
    try {
      await followGame(game.id);
      dispatch({ 
        type: Action.FollowGame, 
        payload: {
          gameId: game.id,
          userId: state.user?.id
        } 
      });
    } catch (err) {
      setErrorMessage(err);
    }
  }, [dispatch, game, state.user]);

  const onUnfollow = useCallback(async () => {
    try {
      await unfollowGame(game.id);

      dispatch({
        type: Action.UnfollowGame,
        payload: {
          gameId: game.id,
          userId: state.user?.id 
        } 
      });
    } catch (err) {
      setErrorMessage(err);
    }
  }, [dispatch, game, state.user]);

  const onClick = useCallback(({ row }) => {
    navigate(`/users/${row.id}`)
  }, [navigate])

  return (
    <Box
      sx={{ 
        backgroundImage: 'linear-gradient(to bottom right, #009688, #FFFFFF)', 
        minHeight: '100vh', 
        padding: '20px' 
      }}
    >
      <Stack spacing={2}>
        <Container 
          sx={{
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between' 
          }}
        >
          <Typography variant="h3">
            { game?.name ?? '' }
          </Typography>
          { state.user && (
            <FollowButton 
              data-testid="followButton"
              isFollowing={isFollowing} 
              onClick={isFollowing ? onUnfollow : onFollow} 
            />
          ) }
        </Container>
        <Paper
          elevation={3}
          sx={{
            display: 'flex', 
            marginBottom: '20px', 
            marginTop: '20px',
            padding: '20px',
            justifyContent: 'space-evenly' 
          }}
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
          sx={{
            display: 'flex',
            marginTop: 4,
            marginBottom: 4
          }}
        >
          <Paper
            elevation={3} 
            sx={{
              flexGrow: 2, 
              marginRight: 4, 
              padding: 3
            }}
          >
            <Typography>Skill Ratings</Typography>
            <BarChart
              series={ratingsData.skill}
              height={290}
              xAxis={[{ 
                data: Object.values(state.skills).map(({ name }) => name),
                scaleType: 'band'
              }]}
            />
          </Paper>
          <Paper
            elevation={3} 
            sx={{ 
              flexGrow: 1, 
              padding: 3 
            }}
          >
            <Typography>Attribute Ratings</Typography>
            <BarChart
              layout="horizontal"
              series={ratingsData.attribute}
              height={290}
              yAxis={[{ 
                data: Object.values(state.attributes).map(({ name }) => name), 
                scaleType: 'band' 
              }]}
              margin={{ left: 100 }}
            />
          </Paper>
        </Stack>
        <DataGrid
          columnVisibilityModel={{ id: false }}
          columns={ columns }
          onRowClick={ onClick }
          rows={ followers }
          slots={{ toolbar: () => <Typography sx={{ padding: 3 }}>Followers</Typography> }}
          sx={{
            backgroundColor: 'white',
            marginTop: 2,
            marginBottom: 2
          }}
        />
        {errorMessage && (
          <Alert
            elevation={3} 
            severity="error"
          >
            {errorMessage}
          </Alert>
        )}
      </Stack>
    </Box>
  )
}
