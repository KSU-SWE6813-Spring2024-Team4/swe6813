import {
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
import {
  render,
  screen
} from '@testing-library/react';
import GamesPage from './GamesPage';
import * as Store from '../../store';

jest.mock('@mui/x-charts', () => ({ 
  BarChart: jest.fn().mockImplementation(({ children }) => children)
}));

test('that games are rendered properly', async () => {
  jest.spyOn(Store, 'useAppContext').mockReturnValue({ 
    state: { 
      games: [{ id: 1, name: 'Assassin\'s Creed Valhalla' }],
      gameFollowers: { 1: [] } 
    } 
  });

  const router = createMemoryRouter(
    [{ 
      path: "/games", 
      element: (
        <Store.StateProvider>
          <GamesPage/>
        </Store.StateProvider>
      )
    }],
    { initialEntries: ["/games"] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByText('Assassin\'s Creed Valhalla')).toBeVisible();
});