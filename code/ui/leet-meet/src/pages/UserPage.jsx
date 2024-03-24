import { Button, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ATTRIBUTES, SKILLS } from '../util/Constants';
import { getRatingCounts, getTopRatingsForUser } from '../util/Calculator';
import { Action, store } from '../store';

const gameColumns = [
  { field: 'id' },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'attribute', headerName: 'Attribute' },
  { field: 'skill', headerName: 'Skill' }
]

const followedUserColumns = [
  { field: 'id' },
  { field: 'username', headerName: 'Username', width: 200 }
]

export default function UserPage() {
  const { user } = useLoaderData();
  const { dispatch, state } = useContext(store);
  const navigate = useNavigate();

  const [reviewAttribute, setReviewAttribute] = useState(null);
  const [reviewSkill, setReviewSkill] = useState(null);

  const ratings = useMemo(() => {
    return Object.values(state.ratings).reduce((acc, userRatings) => {
      if (userRatings[user?.id]) {
        acc['attribute'] = [...acc['attribute'], ...userRatings[user?.id].attribute]
        acc['skill'] = [...acc['skill'], ...userRatings[user?.id].skill]
      }

      return acc;
    }, { attribute: [], skill: [] });
  }, [state.ratings]);

  const topRatingsByGame = useMemo(() => {
    const ratingsByGame = Object.keys(state.ratings).reduce((acc, gameId) => {
      if (state.ratings[gameId][user?.id]) {
        if (!acc[gameId]) {
          acc[gameId] = { attribute: [], skill: [] };
        }
        
        acc[gameId]['attribute'] = [...acc[gameId]['attribute'], ...state.ratings[gameId][user?.id].attribute]
        acc[gameId]['skill'] = [...acc[gameId]['skill'], ...state.ratings[gameId][user?.id].skill]
      }

      return acc;
    }, {});

    return Object.keys(ratingsByGame).reduce((acc, gameId) => {
      acc[gameId] = getTopRatingsForUser(ratingsByGame[gameId]);
      return acc
    }, {});
  }, [state.ratings, user]);

  const ratingData = useMemo(() => {
    const { skill, attribute } = getRatingCounts(ratings);

    return {
      skill: [{ data: SKILLS.map((SKILL) => skill[SKILL]) }],
      attribute: [{ data: ATTRIBUTES.map((ATTRIBUTE) => attribute[ATTRIBUTE]) }]
    }
  }, [ratings])

  const gamesData = useMemo(() => {
    const games = Object.keys(state.gameFollowers).reduce((acc, gameId) => {
      const isFollowing = state.gameFollowers[gameId].find((followerId) => `${followerId}` === `${user?.id}`);
      if (isFollowing) {
        acc.push({ ...state.games.find((game) => `${game.id}` === gameId), ...topRatingsByGame[gameId] })
      }
      return acc;
    }, [])

    return games
  }, [state.games, state.gameFollowers, user])

  const followedUsersData = useMemo(() => {
    const followedUsers = Object.keys(state.userFollowers).reduce((acc, userId) => {
      const isFollowing = state.userFollowers[userId].find((followerId) => followerId === user?.id);
      if (isFollowing) {
        acc.push(state.users[userId]);
      }
      return acc;
    }, []);

    return followedUsers;
  }, [state.userFollowers, state.users, user]);

  const topRatings = useMemo(() => {
    if (!ratings) {
      return {}
    }

    return getTopRatingsForUser(ratings);
  }, [ratings, user])

  const isSelf = useMemo(() => {
    return user?.id === state.user?.id
  }, [user, state.user])

  const isFollowing = useMemo(() => {
    if (!state.userFollowers[user?.id]) {
      return false;
    }

    return !!state.userFollowers[user.id].find((followerId) => followerId === state.user?.id)
  }, [state.userFollowers, state.user, user])

  const onChangeReviewAttribute = useCallback(({ target }) => {
    setReviewAttribute(target.value);
  }, [setReviewAttribute]);

  const onChangeReviewSkill = useCallback(({ target }) => {
    setReviewSkill(target.value)
  }, [setReviewSkill]);

  const onGameClick = useCallback((game) => {
    navigate(`/games/${game.id}`);
  }, [navigate]);

  const onFollow = useCallback(() => {
    dispatch({ type: Action.FollowUser, payload: { followedUserId: user.id, userId: state.user?.id } })
  }, [dispatch, user, state.user]);

  const onUnfollow = useCallback(() => {
    dispatch({ type: Action.UnfollowUser, payload: { followedUserId: user.id, userId: state.user?.id } })
  }, [dispatch, user, state.user]);

  const onFollowedUserClick = useCallback(({ row }) => {
    navigate(`/users/${row.id}`)
  }, [navigate])

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography>{user?.username}</Typography>
        { state.user && !isSelf && !isFollowing && <Button onClick={onFollow}>Follow</Button> }
        { state.user && !isSelf && isFollowing && <Button onClick={onUnfollow}>Unfollow</Button> }
      </Stack>
      <Paper elevation={3}>
        <Typography>Top Player Skill: {topRatings.skill}</Typography>
        <Typography>Top Player Attribute: {topRatings.attribute}</Typography>
      </Paper>
      <Paper elevation={3}>
        <DataGrid
          columnVisibilityModel={{ id: false }}
          columns={ gameColumns }
          onRowClick={ onGameClick }
          rows={ gamesData }
          slots={{ toolbar: () => <Typography>Games</Typography> }}
        />
      </Paper>
      <Stack direction="row" sx={{ display: 'flex', marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ flexGrow: 2, marginRight: 4, padding: 3 }}>
          <Typography>Skill Ratings</Typography>
          <BarChart
            series={ratingData.skill}
            height={290}
            xAxis={[{ data: SKILLS, scaleType: 'band' }]}
          />
        </Paper>
        <Paper elevation={3} sx={{ flexGrow: 1, padding: 3 }}>
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
      { state.user && !isSelf && (
        <Paper elevation={3}>
          <Typography>Review Player</Typography>
          <Typography>How would you describe this player?</Typography>
          <RadioGroup
            row
            value={reviewAttribute}
            onChange={onChangeReviewAttribute}
          >
            { ATTRIBUTES.map((attribute) => (
              <FormControlLabel 
                key={attribute} 
                value={attribute} 
                control={<Radio />} 
                label={attribute} 
              />
            )) }
          </RadioGroup>
          <Typography>How would you rate this player's skill?</Typography>
          <RadioGroup
            row
            value={reviewSkill}
            onChange={onChangeReviewSkill}
          >
            { SKILLS.map((skill) => (
              <FormControlLabel
                key={skill}
                value={skill}
                control={<Radio />}
                label={skill} 
              />
            )) }
          </RadioGroup>
          <Button>Submit</Button>
        </Paper>
      ) }
    </Stack>
  );
}