import { useContext, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AppRoot from './pages/AppRoot';
import GamePage from './pages/GamePage';
import GamesPage from './pages/GamesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserPage from './pages/UserPage';
import mocks from './mocks';
import { Action, store } from './store';

function App() {
  const { dispatch, state } = useContext(store);

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
            game: state.games.find((game) => `${game.id}` === params.gameId),
            ratings: state.ratings[params.gameId]
          })
        },
        {
          path: 'users/:userId',
          element: <UserPage />,
          loader: ({ params }) => ({ 
            ratings: Object.values(state.ratings).reduce((acc, userRatings) => {
              if (userRatings[params.userId]) {
                acc['attribute'] = [...acc['attribute'], ...userRatings[params.userId].attribute]
                acc['skill'] = [...acc['skill'], ...userRatings[params.userId].skill]
              }
              return acc;
            }, { attribute: [], skill: [] }), 
            user: state.users[params.userId] 
          })
        }
      ]
    }
  ]);

  useEffect(() => {
    // TODO: make real calls
    dispatch({ type: Action.LoadGames, payload: mocks.games });
    dispatch({ type: Action.LoadGameFollowers, payload: mocks.gameFollowers });
    dispatch({ type: Action.LoadUsers, payload: mocks.users });
    dispatch({ type: Action.LoadRatings, payload: mocks.ratings });
  }, [dispatch])

  return (
    <RouterProvider router={router} />
  )
}

export default App;
