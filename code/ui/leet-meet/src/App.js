import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AppRoot from './components/AppRoot/AppRoot';
import GamePage from './pages/GamePage/GamePage';
import GamesPage from './pages/GamesPage/GamesPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserPage from './pages/UserPage/UserPage';
import mocks from './mocks';
import {
  Action,
  useAppContext
} from './store';
import { getFollowedGames, getGames, getUsers } from './util/Api/MainApi';

function App() {
  const {
    dispatch,
    state
  } = useAppContext();

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    { 
      path: '/',
      element: <AppRoot />,
      children: [
        {
          path: 'games',
          element: <GamesPage />
        },
        {
          path: 'games/:gameId',
          element: <GamePage />,
          loader: ({ params }) => ({
            game: state.games.find((game) => `${game.id}` === params.gameId)
          })
        },
        {
          path: 'users/:userId',
          element: <UserPage />,
          loader: ({ params }) => ({ 
            user: state.users[params.userId]
          })
        }
      ]
    }
  ]);

  const loadGames = async () => {
    try {
      const games = await getGames();
      dispatch({
        type: Action.LoadGames,
        payload: games.flatMap(({ game }) => game) 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const users = await getUsers();
      dispatch({ type: Action.LoadUsers, 
        payload: users.flatMap(({ user }) => user).reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {}) 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadFollowedGames = async (users) => {
    try {
      const followedGamesByUser = await Promise.all(users.map((user) => getFollowedGames(user.id)));
      const followedGamesByGame = followedGamesByUser.reduce((acc, curr) => {
        const { games, userId } = curr;
        games.forEach((game) => {
          acc[game.id] = acc[game.id] ? [...acc[game.id], userId] : [userId];
        });

        return acc;
      }, {});

      console.log({ followedGamesByGame })
      dispatch({ type: Action.LoadGameFollowers, payload: followedGamesByGame });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGames();
    loadUsers();

    dispatch({ type: Action.LoadRatings, payload: mocks.ratings });
  }, [dispatch])

  useEffect(() => {
    loadFollowedGames(Object.values(state.users));
  }, [state.users]);

  return (
    <RouterProvider router={router} />
  )
}

export default App;
