import { act } from 'react-dom/test-utils';
import {
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import * as Store from '../../store';
import * as AuthApi from '../../util/Api/AuthApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
 useNavigate: () => jest.fn()
}));

test('that user is warned of empty fields', async () => {
  render(
    <Store.StateProvider>
      <LoginPage/>
    </Store.StateProvider>
  );

  await act(() => {
    userEvent.click(screen.getByTestId('loginButton'));
  });

  expect(await screen.findByText('All fields must be filled!')).toBeVisible();
});

test('that user can login successfully', async () => {
  const dispatch = jest.fn();
  jest.spyOn(AuthApi, 'login').mockReturnValue(Promise.resolve({ id: 1, name: 'test' }));

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ dispatch });

  render(
    <Store.StateProvider>
      <LoginPage/>
    </Store.StateProvider>
  );

  await act(async () => {
    userEvent.type(screen.getByPlaceholderText('Username'), 'test');
    userEvent.type(screen.getByPlaceholderText('Password'), 'test');
    await userEvent.click(screen.getByTestId('loginButton'));
  });

  expect(dispatch.mock.calls).toHaveLength(1);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({
    type: Store.Action.LoginUser,
    payload: {
      id: 1,
      name: 'test'
    }
  });
});
