import {
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
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import {
  Action,
  useAppContext 
} from '../../store';
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
]

const followedUserColumns = [
  { field: 'id' },
  {
    field: 'username',
    headerName: 'Name',
    width: 200
  }
]

export default function UserPage() {
  const { user } = useLoaderData();
  const {
    dispatch,
    state 
  } = useAppContext();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  const ratings = useMemo(
    () => Object.values(state.ratings).reduce((acc, userRatings) => {
      userRatings[user?.id]?.forEach((rating) => {
        acc.attribute.push(rating.attribute_id);
        acc.skill.push(rating.skill_id);
      });

      return acc;
    }, { attribute: [], skill: [] }), 
    [state.ratings, user]
  );

  const topRatingsByGame = useMemo(() => {
    const ratingsByGame = Object.keys(state.ratings).reduce((acc, gameId) => {
      if (state.ratings[gameId][user?.id]) {
        if (!acc[gameId]) {
          acc[gameId] = { 
            attribute: [], 
            skill: [] 
          };
        }
        
        state.ratings[gameId][user.id].forEach((rating) => {
          acc[gameId].attribute.push(rating.attribute_id);
          acc[gameId].skill.push(rating.skill_id);
        });
      }

      return acc;
    }, {});

    return Object.keys(ratingsByGame).reduce((acc, gameId) => {
      acc[gameId] = getTopRatingsForUser(ratingsByGame[gameId]);
      return acc
    }, {});
  }, [state.ratings, user]);

  const ratingData = useMemo(() => {
    const { 
      skill: skillCount, 
      attribute: attributeCount 
    } = getRatingCounts(ratings);

    return {
      skill: [{ 
        data: Object.values(state.skills).map((skill) => skillCount[skill.id] ?? 0)
      }],
      attribute: [{
        data: Object.values(state.attributes).map((attribute) => attributeCount[attribute.id] ?? 0)
      }]
    }
  }, [ratings, state.skills, state.attributes])

  const gamesData = useMemo(() => {
    const games = Object.keys(state.gameFollowers).reduce((acc, gameId) => {
      const isFollowing = state.gameFollowers[gameId].find(
        (followerId) => `${followerId}` === `${user?.id}`
      );

      if (isFollowing) {
        acc.push({ 
          ...state.games.find((game) => `${game.id}` === gameId), 
          attribute: state.attributes[topRatingsByGame[gameId]?.attribute]?.name,
          skill: state.skills[topRatingsByGame[gameId]?.skill]?.name
        });
      }

      return acc;
    }, [])

    return games
  }, [state.games, state.gameFollowers, user, topRatingsByGame, state.skills, state.attributes])

  const followedUsersData = useMemo(() => {
    if (!state.followedUsers) {
      return [];
    }

    return state.followedUsers.map((userId) => state.users[userId]);
  }, [state.followedUsers, state.users]);

  const topRatings = useMemo(() => {
    if (!ratings || !state.skills || !state.attributes) {
      return {};
    }

    const { 
      skill: topSkillId, 
      attribute: topAttributeId 
    } =  getTopRatingsForUser(ratings)
    
    return { 
      skill: state.skills[topSkillId]?.name, 
      attribute: state.attributes[topAttributeId]?.name 
    };
  }, [ratings, state.skills, state.attributes])

  const isSelf = useMemo(() => `${user?.id}` === `${state.user?.id}`, [user, state.user]);

  const isFollowing = useMemo(() => {
    if (!state.followedUsers) {
      return false;
    }

    return !!state.followedUsers.find((userId) => userId === user.id);
  }, [state.followedUsers, user]);

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

  const onUnfollow = useCallback(async() => {
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
  }, [navigate])

  const onReviewError = (err) => {
    setErrorMessage(err.message);
  };

  return (
    <Stack sx={{ background: 'linear-gradient(to bottom right, #009688, #FFFFFF)', minHeight: '100vh', padding: '20px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Typography variant="h3">{user?.name}</Typography>
        { state.user && !isSelf && (
          <FollowButton 
            data-testid="followButton" 
            isFollowing={isFollowing} 
            onClick={isFollowing ? onUnfollow : onFollow} 
          />
        ) }
      </Stack>
      <Paper
        elevation={3}
        sx={{ 
          display: 'flex', 
          marginTop: 4, 
          marginBottom: 4, 
          padding: 2, 
          justifyContent: 'space-evenly' 
        }}
      >
        <Typography>
          Top Player Skill: {topRatings.skill}
        </Typography>
        <Typography>
          Top Player Attribute: {topRatings.attribute}
        </Typography>
      </Paper>
      <Paper elevation={3}>
      <Typography sx={{ marginBottom: 2, padding: 3}}>Games</Typography>
        <DataGrid
          data-testid="followedGamesTable"
          columnVisibilityModel={{ id: false }}
          columns={ gameColumns }
          onRowClick={ onGameClick }
          rows={ gamesData }
        />
      </Paper>
      <Stack
        direction="row"
        sx={{ 
          display: 'flex', 
          marginTop: 4, 
          marginBottom: 4 
        }}
      >
        { ratingData.skill[0].data.length > 0 && (
          <Paper
            elevation={3}
            sx={{ flexGrow: 2, marginRight: 4, padding: 3 }}
          >
            <Typography>Skill Ratings</Typography>
            <BarChart
              series={ratingData.skill}
              height={290}
              xAxis={[{ data: Object.values(state.skills).map(({ name }) => name), scaleType: 'band' }]}
            />
          </Paper>
        ) }
        { ratingData.attribute[0].data.length > 0 && (
          <Paper
            elevation={3} 
            sx={{ flexGrow: 1, padding: 3 }}
          >
            <Typography>Attribute Ratings</Typography>
            <BarChart
              layout="horizontal"
              series={ratingData.attribute}
              height={290}
              yAxis={[{ 
                data: Object.values(state.attributes).map(({ name }) => name), 
                scaleType: 'band' 
              }]}
              margin={{ left: 100 }}
            />
          </Paper>
        ) }
      </Stack>
      { isSelf && (
        <Paper elevation={3}>
          <DataGrid
            columnVisibilityModel={{ id: false }}
            columns={ followedUserColumns }
            rows={ followedUsersData }
            onRowClick={ onFollowedUserClick }
            slots={{ toolbar: () => <Typography>Followed Users</Typography> }}
          />
        </Paper>
      )}
      { state.user && !isSelf && isFollowing && (
        <ReviewForm 
          followedGames={ gamesData } 
          onError={ onReviewError } 
          reviewedUser={ user } 
        />
      ) }
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
  );
}