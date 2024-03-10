import { render, screen } from '@testing-library/react';
import LoginBox from './LoginBox';
import { BrowserRouter } from 'react-router-dom';

describe('Login Auth Box Tests', () => {
    test('render Login Box page', () => {
        render(
            <BrowserRouter>
                <LoginBox loginUser={jest.fn()} onRegisterClick={ jest.fn() }/>
            </BrowserRouter>
        );
        expect(screen.getByTestId('login-header')).toBeInTheDocument();
    });
})