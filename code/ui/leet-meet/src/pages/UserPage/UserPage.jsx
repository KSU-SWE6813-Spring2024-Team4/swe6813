import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
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
  ATTRIBUTES,
  SKILLS
} from '../../util/Constants';
import {
  getRatingCounts,
  getTopRatingsForUser
} from '../../util/Calculator/Calculator';
import {
  followUser,
  unfollowUser
} from '../../util/Api/MainApi';

const gameColumns = [
  { field: 'id' },
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'attribute',
    headerName: 'Attribute'
  },
  {
    field: 'skill',
    headerName: 'Skill'
  }
];

const followedUserColumns = [
  { field: 'id' },
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  }
];

export default function UserPage() {
  const { user } = useLoaderData();
  const {
    dispatch,
    state
  } = useAppContext();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [reviewGame, setReviewGame] = useState('');
  const [reviewAttribute, setReviewAttribute] = useState('');
  const [reviewSkill, setReviewSkill] = useState('');

  const ratings = useMemo(
    () => Object.values(state.ratings).reduce((acc, userRatings) => {
      if (userRatings[user?.id]) {
        acc['attribute'] = [...acc['attribute'], ...userRatings[user?.id].attribute];
        acc['skill'] = [...acc['skill'], ...userRatings[user?.id].skill];
      }

      return acc;
    }, { attribute: [], skill: [] }),
    [state.ratings, user]
  );

  const topRatingsByGame = useMemo(() => {
    const ratingsByGame = Object.keys(state.ratings).reduce((acc, gameId) => {
      if (state.ratings[gameId][user?.id]) {
        if (!acc[gameId]) {
          acc[gameId] = { attribute: [], skill: [] };
        }

        acc[gameId]['attribute'] = [...acc[gameId]['attribute'], ...state.ratings[gameId][user?.id].attribute];
        acc[gameId]['skill'] = [...acc[gameId]['skill'], ...state.ratings[gameId][user?.id].skill];
      }

      return acc;
    }, {});

    return Object.keys(ratingsByGame).reduce((acc, gameId) => {
      acc[gameId] = getTopRatingsForUser(ratingsByGame[gameId]);
      return acc;
    }, {});
  }, [state.ratings, user]);

  const ratingData = useMemo(() => {
    const { skill, attribute } = getRatingCounts(ratings);

    return {
      skill: [{ data: SKILLS.map((SKILL) => skill[SKILL]) }],
      attribute: [{ data: ATTRIBUTES.map((ATTRIBUTE) => attribute[ATTRIBUTE]) }]
    };
  }, [ratings]);

  const gamesData = useMemo(() => {
    const games = Object.keys(state.gameFollowers).reduce((acc, gameId) => {
      const isFollowing = state.gameFollowers[gameId].find((followerId) => `${followerId}` === `${user?.id}`);
      if (isFollowing) {
        acc.push({
          ...state.games.find((game) => `${game.id}` === gameId),
          ...topRatingsByGame[gameId]
        });
      }
      return acc;
    }, []);

    return games;
  }, [state.games, state.gameFollowers, user, topRatingsByGame]);

  const followedUsersData = useMemo(() => {
    if (!state.followedUsers) {
      return [];
    }

    return state.followedUsers.map((userId) => state.users[userId]);
  }, [state.followedUsers, state.users]);

  const topRatings = useMemo(() => {
    if (!ratings) {
      return {};
    }

    return getTopRatingsForUser(ratings);
  }, [ratings]);

  const isSelf = useMemo(() => `${user?.id}` === `${state.user?.id}`, [user, state.user]);

  const isFollowing = useMemo(() => {
    if (!state.followedUsers) {
      return false;
    }

    return !!state.followedUsers.find((userId) => userId === user.id);
  }, [state.followedUsers, user]);

  const onChangeReviewGame = useCallback(({ target }) => {
    setReviewGame(target.value);
  }, [setReviewGame]);

  const onChangeReviewAttribute = useCallback(({ target }) => {
    setReviewAttribute(target.value);
  }, [setReviewAttribute]);

  const onChangeReviewSkill = useCallback(({ target }) => {
    setReviewSkill(target.value);
  }, [setReviewSkill]);

  const onGameClick = useCallback((game) => {
    navigate(`/games/${game.id}`);
  }, [navigate]);

  const onFollow = useCallback(async () => {
    try {
      await followUser(user.id);

      dispatch({
        type: Action.FollowUser,
        payload: {
          followedUserId: user.id,
        }
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [dispatch, user]);

  const onUnfollow = useCallback(async () => {
    try {
      await unfollowUser(user.id);
      dispatch({
        type: Action.UnfollowUser,
        payload: {
          followedUserId: user.id,
        }
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [dispatch, user]);

  const onFollowedUserClick = useCallback(({ row }) => {
    navigate(`/users/${row.id}`);
  }, [navigate]);

  const onSubmitReview = useCallback(() => {
    if (!reviewGame || !reviewAttribute || !reviewSkill) {
      return;
    }

    dispatch({
      type: Action.SubmitRating,
      payload: {
        gameId: reviewGame,
        fromId: state.user?.id,
        toId: user.id,
        skill: reviewSkill,
        attribute: reviewAttribute
      }
    });
  }, [reviewGame, reviewAttribute, reviewSkill, dispatch, state.user, user]);

  return (
    <Stack sx={{ background: 'linear-gradient(to bottom right, #009688, #FFFFFF)', minHeight: '100vh', padding: '20px' }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography variant="h3">{user?.name}</Typography>
          {state.user && !isSelf && (
            <FollowButton
              data-testid="followButton"
              isFollowing={isFollowing}
              onClick={isFollowing ? onUnfollow : onFollow}
            />
          )}
        </Stack>
        <Paper
          elevation={3}
          sx={{ display: 'flex', marginTop: 4, marginBottom: 4, padding: 2, justifyContent: 'space-evenly' }}
        >
          <Typography>Top Player Skill: {topRatings.skill}</Typography>
          <Typography>Top Player Attribute: {topRatings.attribute}</Typography>
        </Paper>
        <Paper elevation={3}>
          <Typography sx={{ marginBottom: 2, padding: 3}}>Games</Typography>
          <DataGrid
            data-testid="followedGamesTable"
            columnVisibilityModel={{ id: false }}
            columns={gameColumns}
            onRowClick={onGameClick}
            rows={gamesData}
          />
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
              series={ratingData.skill}
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
              series={ratingData.attribute}
              height={290}
              yAxis={[{ data: ATTRIBUTES, scaleType: 'band' }]}
              margin={{ left: 100 }}
            />
          </Paper>
        </Stack>
        {isSelf && (
          <Paper elevation={3}>
            <Typography sx={{ marginBottom: 2, padding: 3 }}>Followed Users</Typography>
            <DataGrid
              columnVisibilityModel={{ id: false }}
              columns={followedUserColumns}
              rows={followedUsersData}
              onRowClick={onFollowedUserClick}
            />
          </Paper>
        )}
        {state.user && !isSelf && isFollowing && (
          <Paper
            elevation={3}
            sx={{ padding: 2 }}
          >
            <Typography
              sx={{ marginBottom: 2 }}
              variant="h4"
            >
              Review Player
            </Typography>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Game</InputLabel>
              <Select
                value={reviewGame}
                label="Game"
                onChange={onChangeReviewGame}
              >
                {gamesData.map((game) => (
                  <MenuItem
                    key={game.id}
                    value={game.id}
                  >
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography>How would you describe this player?</Typography>
            <RadioGroup
              row
              value={reviewAttribute}
              onChange={onChangeReviewAttribute}
            >
              {ATTRIBUTES.map((attribute) => (
                <FormControlLabel
                  key={attribute}
                  value={attribute}
                  control={<Radio />}
                  label={attribute}
                />
              ))}
            </RadioGroup>
            <Typography>How would you rate this player's skill?</Typography>
            <RadioGroup
              row
              value={reviewSkill}
              onChange={onChangeReviewSkill}
            >
              {SKILLS.map((skill) => (
                <FormControlLabel
                  key={skill}
                  value={skill}
                  control={<Radio />}
                  label={skill}
                />
              ))}
            </RadioGroup>
            <Button onClick={onSubmitReview}>Submit</Button>
          </Paper>
        )}
        {errorMessage && (
          <Alert
            elevation={3}
            severity="error"
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
}
