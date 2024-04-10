import { render, screen } from '@testing-library/react';
import AppRoot from './AppRoot';
import { createUser } from '../../mocks';
import * as Store from '../../store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

test('that it render properly based on the logged in user', async () => {
  const user = createUser({ id: 1 });

  jest.spyOn(Store, 'useAppContext').mockReturnValue({
    state: { user }
  });

  render(
    <Store.StateProvider>
      <AppRoot/>
    </Store.StateProvider>
  );

  expect(await screen.findByText(user.username)).toBeVisible();
  expect(await screen.findByText(/Profile/)).toBeVisible();
});
