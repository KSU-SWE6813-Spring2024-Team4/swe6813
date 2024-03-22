import { createContext, useReducer } from 'react';

const Action = {
  AddFriend: 'ADD_FRIEND',
  LoadFriends: 'LOAD_FRIENDS',
  LoadGames: 'LOAD_GAMES',
  LoadGameFollowers: 'LOAD_GAME_FOLLOWERS',
  LoadRatings: 'LOAD_RATINGS',
  LoadUsers: 'LOAD_USERS',
  LoginUser: 'LOGIN_USER',
  RemoveFriend: 'REMOVE_FRIEND'
}

const initialState = {
  friends: [],
  games: [],
  gameFollowers: {},
  ratings: {},
  user: null,
  users: {}
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case [Action.AddFriend]:
        return { ...state, friends: [...state.friends, action.payload] };
      case [Action.LoadFriends]:
        return { ...state, friends: action.payload };
      case Action.LoadGames:
        return { ...state, games: action.payload };
      case Action.LoadGameFollowers:
        return { ...state, gameFollowers: action.payload };
      case Action.LoadRatings:
        return { ...state, ratings: action.payload };
      case Action.LoadUsers:
        return { ...state, users: action.payload }
      case [Action.LoginUser]:
        return { ...state, user: action.payload };
      case [Action.RemoveFriend]:
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