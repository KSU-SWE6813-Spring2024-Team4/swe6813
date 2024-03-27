import { act } from 'react-dom/test-utils';
import {
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { StateProvider } from '../../store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => jest.fn()
}));

test('that user is warned of empty fields', async () => {
  render(
    <StateProvider>
      <LoginPage/>
    </StateProvider>
  );

  await act(() => {
    userEvent.click(screen.getByTestId('loginButton'));
  });

  expect(await screen.findByText('All fields must be filled!')).toBeVisible();
});

test('that user can login successfully', async () => {
  render(
    <StateProvider>
      <LoginPage/>
    </StateProvider>
  );

  await act(() => {
    userEvent.type(screen.getByPlaceholderText('Username'), 'test');
    userEvent.type(screen.getByPlaceholderText('Password'), 'test');
    userEvent.click(screen.getByTestId('loginButton'));
  });

  expect(await screen.findByText('Logging in!')).toBeVisible();
});
