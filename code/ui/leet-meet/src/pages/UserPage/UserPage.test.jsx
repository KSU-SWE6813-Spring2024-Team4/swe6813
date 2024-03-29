import {
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
import {
  render,
  screen
} from '@testing-library/react';
import UserPage from './UserPage';
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

test('that it renders followed games', async () => {
  const game = { id: 1, title: 'Assassin\'s Creed Valhalla' };
  const user = createUser({ id: 1 });
  const followedUser = createUser({ id: 2 });

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
      userFollowers: { [followedUser.id]: [user.id] },
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

  expect(await screen.findByText(game.title)).toBeVisible();
  expect(await screen.findByText(attributeRating.type)).toBeVisible();
  expect(await screen.findByText(skillRating.type)).toBeVisible();
});
