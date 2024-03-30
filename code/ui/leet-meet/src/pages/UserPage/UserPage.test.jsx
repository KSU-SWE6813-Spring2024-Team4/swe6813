import { act } from 'react-dom/test-utils';
import {
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
import {
  render,
  screen,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserPage from './UserPage';
import { 
  createRating,
  createUser
} from '../../mocks';
import * as Store from '../../store';
import { getRandomInt } from '../../util/Calculator/Calculator';
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
const followedUser = createUser({ id: 2 });

test('that a user cannot follow themselves', async () => {
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      userFollowers: {},
      users: { [user.id]: user },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user }) 
    }],
    { initialEntries: ["/users/1"] },
  );

  render(<RouterProvider router={router} />);

  await act(() => {
    expect(screen.queryByTestId('followButton')).toBeNull();
  });
});

test('that a user can follow another user', async () => {
  const dispatch = jest.fn();

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    dispatch,
    state: { 
      games: [],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      userFollowers: { [followedUser.id]: [] },
      users: { 
        [user.id]: user, 
        [followedUser.id]: followedUser 
      },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user: followedUser }) 
    }],
    { initialEntries: ["/users/2"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({ 
    type: Store.Action.FollowUser, payload: { followedUserId: followedUser.id, userId: user.id } });
});

test('that a user can unfollow another user', async () => {
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
      userFollowers: { [followedUser.id]: [user.id] },
      users: { [user.id]: user, [followedUser.id]: followedUser },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user: followedUser }) 
    }],
    { initialEntries: ["/users/2"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByTestId('followButton')).toBeVisible();

  await act(() => {
    userEvent.click(screen.getByTestId('followButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({ type: Store.Action.UnfollowUser, payload: { followedUserId: followedUser.id, userId: user.id } });
});

test('that it renders followed games', async () => {
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
      userFollowers: { },
      users: { [user.id]: user }
    }
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user }) 
    }],
    { initialEntries: ["/users/1"] },
  );

  render(<RouterProvider router={router} />);

  const followedGamesTable = await screen.findByTestId('followedGamesTable');

  expect(await within(followedGamesTable).findByText(game.title)).toBeVisible();
  expect(await within(followedGamesTable).findByText(attributeRating.type)).toBeVisible();
  expect(await within(followedGamesTable).findByText(skillRating.type)).toBeVisible();
});

test('that it shows your followed users', async () => {
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      userFollowers: { [followedUser.id]: [user.id] },
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user }) 
    }],
    { initialEntries: ["/users/1"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByText('Followed Users')).toBeVisible();
  expect(await screen.findByText(followedUser.username)).toBeVisible();
});

test('that it shows review form for followed users', async () => {  
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [followedUser.id, user.id] },
      ratings: {
        [game.id]: {}
      },
      user,
      userFollowers: { [followedUser.id]: [user.id] },
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user: followedUser }) 
    }],
    { initialEntries: ["/users/2"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByText('Review Player')).toBeVisible();
});

test('that it does not show review form for unfollowed users',  async () => {
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [followedUser.id, user.id] },
      ratings: {
        [game.id]: {}
      },
      user,
      userFollowers: { [followedUser.id]: [] },
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
    },
  });

  const router = createMemoryRouter(
    [{ 
      path: "/users/:userId", 
      element: (
        <Store.StateProvider>
          <UserPage/>
        </Store.StateProvider>
      ), 
      loader: () => ({ user: followedUser }) 
    }],
    { initialEntries: ["/users/2"] },
  );

  render(<RouterProvider router={router} />);

  await act(() => {
    expect(screen.queryByTestId('Review Player')).toBeNull();
  });
});