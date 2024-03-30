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
import { 
  createRating,
  createUser
} from '../../mocks';
import * as Store from '../../store';
import { getRandomInt } from '../../util/Calculator';
import { 
  ATTRIBUTES,
  SKILLS
} from '../../util/Constants';

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
    },
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

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({ type: Store.Action.FollowGame, payload: { gameId: game.id, userId: user.id } });
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
    },
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

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({ type: Store.Action.UnfollowGame, payload: { gameId: game.id, userId: user.id } });
});

test('that it renders followers', async () => {
  const attributeRating = createRating({ 
    gameId: game.id,
    toId: user.id,
    type: ATTRIBUTES[getRandomInt(ATTRIBUTES.length)]
  });

  const skillRating = createRating({
    gameId: game.id,
    toId: user.id,
    type: SKILLS[getRandomInt(SKILLS.length)]
  });
  
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [user.id] },
      ratings: {
        [game.id]: { 
          [user.id]: { 
            attribute: [attributeRating], 
            skill: [skillRating] 
          }
        }
      },
      users: { [user.id]: user }
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
      loader: () => ({ game }) }],
    { initialEntries: ["/games/1"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByText(user.username)).toBeVisible();
  expect(await screen.findByText(attributeRating.type)).toBeVisible();
  expect(await screen.findByText(skillRating.type)).toBeVisible();
}); 