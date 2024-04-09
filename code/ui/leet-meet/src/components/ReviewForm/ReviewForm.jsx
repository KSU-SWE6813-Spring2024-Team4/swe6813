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
  Typography
} from '@mui/material';
import { 
  useCallback,
  useState
} from 'react';
import { Action, useAppContext } from '../../store';
import { reviewUser } from '../../util/Api/MainApi';

export default function ReviewForm({ followedGames, onError, reviewedUser }) {
  const {
    dispatch,
    state 
  } = useAppContext();

  const [reviewGame, setReviewGame] = useState('');
  const [reviewAttribute, setReviewAttribute] = useState('');
  const [reviewSkill, setReviewSkill] = useState('');

  const onChangeReviewGame = useCallback(({ target }) => {
    setReviewGame(target.value)
  }, [setReviewGame]);

  const onChangeReviewAttribute = useCallback(({ target }) => {
    setReviewAttribute(target.value);
  }, [setReviewAttribute]);

  const onChangeReviewSkill = useCallback(({ target }) => {
    setReviewSkill(target.value)
  }, [setReviewSkill]);

  const onSubmitReview = useCallback(async () => {
    if (!reviewGame || !reviewAttribute || !reviewSkill) {
      return;
    }

    try {
      await reviewUser({
        game_id: reviewGame,
        attribute_id: reviewAttribute,
        skill_id: reviewSkill, 
        rate_user_id: reviewedUser.id 
      });
    } catch (err) {

    }

    // dispatch({
    //   type: Action.SubmitRating, 
    //   payload: { 
    //     gameId: reviewGame, 
    //     fromId: state.user?.id, 
    //     toId: reviewedUser.id, 
    //     skill: reviewSkill, 
    //     attribute: reviewAttribute 
    //   } 
    // })
  }, [reviewGame, reviewAttribute, reviewSkill, dispatch, state.user, reviewedUser]);

  return (
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
          { followedGames.map((game) => (
            <MenuItem 
              key={game.id} 
              value={game.id}
            >
              {game.name}
            </MenuItem>
          ) ) }
        </Select>
      </FormControl>
      <Typography>How would you describe this player?</Typography>
      <RadioGroup
        row
        value={reviewAttribute}
        onChange={onChangeReviewAttribute}
      >
        { Object.values(state.attributes).map(({ id, name }) => (
          <FormControlLabel 
            key={id} 
            value={id} 
            control={<Radio />} 
            label={name} 
          />
        )) }
      </RadioGroup>
      <Typography>How would you rate this player's skill?</Typography>
      <RadioGroup
        row
        value={reviewSkill}
        onChange={onChangeReviewSkill}
      >
        { Object.values(state.skills).map(({ id, name }) => (
          <FormControlLabel
            key={id}
            value={id}
            control={<Radio />}
            label={name} 
          />
        )) }
      </RadioGroup>
      <Button onClick={ onSubmitReview }>Submit</Button>
    </Paper>
  )
}