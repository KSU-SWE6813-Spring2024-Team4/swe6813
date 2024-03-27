import {
  createContext,
  useContext,
  useReducer 
} from 'react';

const Action = {
  FollowGame: 'FOLLOW_GAME', // done
  FollowUser: 'FOLLOW_USER', // wish
  LoadGames: 'LOAD_GAMES', // done
  LoadGameFollowers: 'LOAD_GAME_FOLLOWERS', // done
  LoadRatings: 'LOAD_RATINGS',
  LoadUsers: 'LOAD_USERS', // done
  LoadUserFollowers: 'LOAD_USER_FOLLOWERS', // done
  LoginUser: 'LOGIN_USER', // done
  SubmitRating: 'SUBMIT_RATING',
  UnfollowGame: 'UNFOLLOW_GAME', // done
  UnfollowUser: 'UNFOLLOW_USER' // done
}

const initialState = {
  games: [],
  gameFollowers: {},
  ratings: {},
  user: null,
  users: {},
  userFollowers: {}
};

const store = createContext(initialState);
const { Provider } = store;

const useAppContext = () => useContext(store);

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case Action.FollowGame: {
        const {
          gameId,
          userId
        } = action.payload;

        return { 
          ...state,
          gameFollowers: {
            ...state.gameFollowers, 
            [gameId]: [
              ...state.gameFollowers[gameId], 
              userId
            ]
          } 
        };
      }
      case Action.FollowUser: {
        const {
          followedUserId,
          userId
        } = action.payload;

        const current = state.userFollowers[followedUserId] ?? [];

        return {
          ...state,
          userFollowers: {
            ...state.userFollowers,
            [followedUserId]: [...current, userId] }
        };
      }
      case Action.LoadGames:
        return {
          ...state,
          games: action.payload
        };
      case Action.LoadGameFollowers:
        return {
          ...state,
          gameFollowers: action.payload
        };
      case Action.LoadRatings:
        return {
          ...state,
          ratings: action.payload
        };
      case Action.LoadUsers:
        return {
          ...state,
          users: action.payload
        };
      case Action.LoadUserFollowers:
        return {
          ...state,
          userFollowers: action.payload
        };
      case Action.LoginUser:
        return { 
          ...state, 
          user: action.payload, 
          users: { 
            ...state.users,
            [action.payload.id]: action.payload 
          } 
        };
      case Action.SubmitRating:
        const {
          gameId,
          toId,
          fromId,
          skill,
          attribute 
        } = action.payload;

        const ratings = state.ratings[gameId][toId];
        const existingSkillRatingIndex = ratings.skill.findIndex(
          (skillRating) => skillRating.fromId === fromId
        );
        const existingAttributeRatingIndex = ratings.attribute.findIndex(
          (skillRating) => skillRating.fromId === fromId
        );

        const updatedSkillRatingsForUser = [...ratings.skill];
        const newSkillRating = { 
          gameId, 
          fromId,
          toId,
          type: skill 
        };
        if (existingSkillRatingIndex) {
          updatedSkillRatingsForUser.splice(existingSkillRatingIndex, 1, newSkillRating);
        } else {
          updatedSkillRatingsForUser.push(newSkillRating);
        }

        const updatedAttributeRatingsForUser = [...ratings.attribute];
        const newAttributeRating = { 
          gameId, fromId, toId, type: attribute 
        };
        if (existingAttributeRatingIndex) {
          updatedAttributeRatingsForUser.splice(existingAttributeRatingIndex, 1, newAttributeRating);
        } else {
          updatedAttributeRatingsForUser.push(newAttributeRating);
        }

        return { 
          ...state,
          ratings: { 
            ...state.ratings,
            [gameId]: { 
              ...state.ratings[gameId], 
              [toId]: { 
                skill: updatedSkillRatingsForUser,
                attribute: updatedAttributeRatingsForUser,
              } 
            } 
          } 
        };
      case Action.UnfollowGame: {
        const index = state.gameFollowers[action.payload.gameId].indexOf(action.payload.userId);
        const newFollowers = [...state.gameFollowers[action.payload.gameId]];
        newFollowers.splice(index, 1);

        return {
          ...state,
          gameFollowers: {
            ...state.gameFollowers, [action.payload.gameId]: newFollowers }
        };
      }
      case Action.UnfollowUser:
        const {
          followedUserId,
          userId 
        } = action.payload;
        
        const followers = state.userFollowers[followedUserId]
        const index = followers.indexOf(userId);
        const newFollowers = [...followers];
        newFollowers.splice(index, 1);

        return {
          ...state,
          userFollowers: {
            ...state.userFollowers,
            [followedUserId]: newFollowers
          }
        };
      default:
        throw new Error("unrecognized action: " + action.type);
    }
  }, initialState)

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  );
};

export { store, StateProvider, Action, useAppContext };