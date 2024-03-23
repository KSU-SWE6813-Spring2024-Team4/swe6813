import { createContext, useReducer } from 'react';

const Action = {
  FollowGame: 'FOLLOW_GAME',
  FollowUser: 'FOLLOW_USER',
  LoadFriends: 'LOAD_FRIENDS',
  LoadGames: 'LOAD_GAMES',
  LoadGameFollowers: 'LOAD_GAME_FOLLOWERS',
  LoadRatings: 'LOAD_RATINGS',
  LoadUsers: 'LOAD_USERS',
  LoadUserFollowers: 'LOAD_USER_FOLLOWERS',
  LoginUser: 'LOGIN_USER',
  UnfollowGame: 'UNFOLLOW_GAME',
  UnfollowUser: 'UNFOLLOW_USER'
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

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case Action.FollowGame:
        return { 
          ...state, gameFollowers: { ...state.gameFollowers, [action.payload.gameId]: [...state.gameFollowers[action.payload.gameId], action.payload.userId] } 
        };
      case Action.FollowUser:
        console.log(action.payload)
        const current = state.userFollowers[action.payload.followedUserId] ? state.userFollowers[action.payload.followedUserId] : []
        return { ...state, userFollowers: { ...state.userFollowers, [action.payload.followedUserId]: [...current, action.payload.userId] } };
      case [Action.LoadFriends]:
        return { ...state, friends: action.payload };
      case Action.LoadGames:
        return { ...state, games: action.payload };
      case Action.LoadGameFollowers:
        return { ...state, gameFollowers: action.payload };
      case Action.LoadRatings:
        return { ...state, ratings: action.payload };
      case Action.LoadUsers:
        return { ...state, users: action.payload };
      case Action.LoadUserFollowers:
        return { ...state, userFollowers: action.payload };
      case Action.LoginUser:
        return { ...state, user: action.payload, users: { ...state.users, [action.payload.id]: action.payload } };
      case Action.UnfollowGame:
        const index = state.gameFollowers[action.payload.gameId].indexOf(action.payload.userId);
        const newFollowers = [...state.gameFollowers[action.payload.gameId]];
        newFollowers.splice(index, 1)

        return { ...state, gameFollowers: { ...state.gameFollowers, [action.payload.gameId]: newFollowers } };
      case Action.UnfollowUser:
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

export { store, StateProvider, Action };