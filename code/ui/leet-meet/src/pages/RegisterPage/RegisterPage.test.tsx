import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  render,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import * as Store from '../../store';
import * as AuthApi from '../../util/Api/AuthApi';

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

test('that user is warned of empty fields', async () => {
  render(
    <Store.StateProvider>
      <RegisterPage />
    </Store.StateProvider>
  );

  await act(() => {
    userEvent.click(screen.getByTestId('registerButton'));
  });

  expect(await screen.findByText('All fields must be filled!')).toBeVisible();
});

test('that user is warned of password mismatches', async () => {
  render(
    <Store.StateProvider>
      <RegisterPage />
    </Store.StateProvider>
  );

  await act(() => {
    userEvent.type(screen.getByPlaceholderText('Username'), 'test');
    userEvent.type(screen.getByPlaceholderText('Password'), 'test');
    userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'test2');
    userEvent.click(screen.getByTestId('registerButton'));
  });

  expect(await screen.findByText('Passwords do not match!')).toBeVisible();
});

test('that user can register successfully', async () => { 
  const dispatch = jest.fn();
  jest.spyOn(AuthApi, 'register').mockReturnValue(Promise.resolve({ id: 1, name: 'test' }));

  jest.spyOn(Store, 'useAppContext').mockReturnValue({ dispatch });

  render(
    <Store.StateProvider>
      <RegisterPage />
    </Store.StateProvider>
  );

  await act(() => {
    userEvent.type(screen.getByPlaceholderText('Username'), 'test');
    userEvent.type(screen.getByPlaceholderText('Password'), 'test');
    userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'test');
    userEvent.click(screen.getByTestId('registerButton'));
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
