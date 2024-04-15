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

const game = { id: 1, name: 'Assassin\'s Creed Valhalla' };
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
      followedUsers: [],
      users: { [user.id]: user },
      skills: {},
      attributes: {}
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

  jest.spyOn(MainApi, 'followUser').mockReturnValue(Promise.resolve({}));

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    dispatch,
    state: { 
      games: [],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      followedUsers: [],
      users: { 
        [user.id]: user, 
        [followedUser.id]: followedUser 
      },
      skills: {},
      attributes: {}
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
    type: Store.Action.FollowUser, 
    payload: { followedUserId: followedUser.id } });
});

test('that a user can unfollow another user', async () => {
  const dispatch = jest.fn();

  jest.spyOn(MainApi, 'unfollowUser').mockReturnValue(Promise.resolve({}));

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    dispatch,
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [] },
      ratings: {
        [game.id]: {}
      },
      user,
      followedUsers: [followedUser.id],
      users: { [user.id]: user, [followedUser.id]: followedUser },
      skills: {},
      attributes: {}
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
    type: Store.Action.UnfollowUser, 
    payload: { followedUserId: followedUser.id } 
  });
});

test('that it renders followed games', async () => {
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [game],
      gameFollowers: { [game.id]: [user.id] },
      ratings: {
        [game.id]: { 
          [user.id]: []
        }
      },
      followedUsers: [],
      users: { [user.id]: user },
      skills: {},
      attributes: {}
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

  expect(await within(followedGamesTable).findByText(game.name)).toBeVisible();
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
      followedUsers: [followedUser.id],
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
      skills: {},
      attributes: {}
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
      followedUsers: [followedUser.id],
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
      skills: {},
      attributes: {}
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
      followedUsers: [followedUser.id],
      users: { 
        [user.id]: user, [followedUser.id]: followedUser 
      },
      skills: {},
      attributes: {}
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