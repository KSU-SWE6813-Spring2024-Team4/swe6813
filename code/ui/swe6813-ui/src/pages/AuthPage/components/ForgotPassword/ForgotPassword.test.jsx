import { render, screen } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import { BrowserRouter } from 'react-router-dom';

describe('Forgot Password Auth Box Tests', () => {
    test('render Forgot Password Box page', () => {
        render(
            <BrowserRouter>
                <ForgotPassword registerUser={jest.fn()}/>
            </BrowserRouter>
        );
        expect(screen.getByTestId('forgot-password-header')).toBeInTheDocument();
    });
})