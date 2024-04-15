import {
  createContext,
  useContext,
  useReducer 
} from 'react';

const Action = {
  FollowGame: 'FOLLOW_GAME', 
  FollowUser: 'FOLLOW_USER', 
  LoadAttributes: 'LOAD_ATTRIBUTES',
  LoadGames: 'LOAD_GAMES',
  LoadGameFollowers: 'LOAD_GAME_FOLLOWERS', 
  LoadRatings: 'LOAD_RATINGS',
  LoadSkills: 'LOAD_SKILLS',
  LoadUsers: 'LOAD_USERS', 
  LoadFollowedUsers: 'LOAD_FOLLOWED_USERS', 
  LoginUser: 'LOGIN_USER', 
  SubmitRating: 'SUBMIT_RATING',
  UnfollowGame: 'UNFOLLOW_GAME', 
  UnfollowUser: 'UNFOLLOW_USER' 
}

const initialState = {
  attributes: {},
  followedUsers: null,
  games: [],
  gameFollowers: {},
  ratings: {},
  skills: {},
  user: null,
  users: {},
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
        } = action.payload;

        return {
          ...state,
          followedUsers: [...state.followedUsers, followedUserId]
        };
      }
      case Action.LoadAttributes:
        return { 
          ...state, 
          attributes: action.payload.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
          }, {}) 
        };
      case Action.LoadFollowedUsers:
        return {
          ...state,
          followedUsers: action.payload
        };
      case Action.LoadGames:
        return {
          ...state,
          games: action.payload,
          gameFollowers: action.payload.reduce((acc, game) => {
            acc[game.id] = [];
            return acc;
          }, {})
        };
      case Action.LoadGameFollowers:
        return {
          ...state,
          gameFollowers: { 
            ...state.gameFollowers, 
            ...action.payload 
          }
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
      case Action.LoadSkills:
        return {
          ...state,
          skills: action.payload.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
          }, {}) 
        };
      case Action.LoginUser:
        return { 
          ...state, 
          user: action.payload,
        };
      case Action.SubmitRating:
        const {
          game_id,
          to_user_id,
          from_user_id,
        } = action.payload;

        const ratings = state.ratings[game_id][to_user_id];
        const existingRatingIndex = ratings.findIndex((rating) => {
          return `${rating.from_user_id}` === `${from_user_id}` && rating.to_user_id === to_user_id && rating.game_id === game_id;
        });

        const updatedRatingsForUser = [...ratings];
        if (existingRatingIndex !== -1) {
          updatedRatingsForUser.splice(existingRatingIndex, 1, action.payload)
        } else {
          updatedRatingsForUser.push(action.payload)
        }

        return { 
          ...state,
          ratings: { 
            ...state.ratings,
            [game_id]: { 
              ...state.ratings[game_id], 
              [to_user_id]: updatedRatingsForUser
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
            ...state.gameFollowers,
            [action.payload.gameId]: newFollowers 
          }
        };
      }
      case Action.UnfollowUser:
        const { followedUserId } = action.payload;
        
        const index = state.followedUsers.indexOf(followedUserId);
        const newFollowedUsers = [...state.followedUsers];
        newFollowedUsers.splice(index, 1);

        return {
          ...state,
          followedUsers: newFollowedUsers
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