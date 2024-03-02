import { render, screen } from '@testing-library/react';
import ChangePassword from './ChangePassword';
import { BrowserRouter } from 'react-router-dom';

describe('Forgot Password Auth Box Tests', () => {
    test('render Forgot Password Box page', () => {
        render(
            <BrowserRouter>
                <ChangePassword registerUser={jest.fn()}/>
            </BrowserRouter>
        );
        expect(screen.getByTestId('change-password-header')).toBeInTheDocument();
    });
})