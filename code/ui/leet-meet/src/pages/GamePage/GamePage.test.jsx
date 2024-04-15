import { act } from 'react-dom/test-utils';
import {
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
import {
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GamePage from './GamePage';
import { createUser } from '../../mocks';
import * as Store from '../../store';
import * as MainApi from '../../util/Api/MainApi';

jest.mock('@mui/x-charts', () => ({ 
  BarChart: jest.fn().mockImplementation(({ children }) => children)
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => jest.fn()
}));

const game = { id: 1, title: 'Assassin\'s Creed Valhalla' };
const user = createUser({ id: 1 });

test('that a user can follow a game', async () => {
  const dispatch = jest.fn();

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    dispatch,
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      users: { [user.id]: user },
      skills: {},
      attributes: {}
    },
  });

  jest.spyOn(MainApi, 'followGame').mockReturnValue(Promise.resolve({}));

  const router = createMemoryRouter(
    [{ 
      path: "/games/:gameId", 
      element: (
        <Store.StateProvider>
          <GamePage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ game }) 
    }],
    { initialEntries: ["/games/1"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({
    type: Store.Action.FollowGame,
    payload: {
      gameId: game.id,
      userId: user.id
    }
  });
});

test('that a user can unfollow a game', async () => {
  const dispatch = jest.fn();

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    dispatch,
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [user.id] },
      ratings: {
        [game.id]: {}
      },
      user,
      users: { [user.id]: user },
      skills: {},
      attributes: {}
    },
  });

  jest.spyOn(MainApi, 'unfollowGame').mockReturnValue(Promise.resolve({}));

  const router = createMemoryRouter(
    [{ 
      path: "/games/:gameId", 
      element: (
        <Store.StateProvider>
          <GamePage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ game }) 
    }],
    { initialEntries: ["/games/1"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({
    type: Store.Action.UnfollowGame,
    payload: {
      gameId: game.id,
      userId: user.id 
    }
  });
});

test('that it renders followers', async () => {  
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [user.id] },
      ratings: {
        [game.id]: { 
          [user.id]: []
        }
      },
      users: { [user.id]: user },
      skills: {},
      attributes: {}
    }
  });

  const router = createMemoryRouter(
    [{ 
      path: "/games/:gameId",
      element: (
        <Store.StateProvider>
          <GamePage/>
        </Store.StateProvider>
      ),
      loader: () => ({ game })
    }],
    { initialEntries: ["/games/1"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByText(user.username)).toBeVisible();
}); 