import { render, screen } from '@testing-library/react';
import SignOut from './SignOut';
import { BrowserRouter } from 'react-router-dom';

describe('Sign Out Auth Box Tests', () => {
    test('render Sign Out Box page', () => {
        render(
            <BrowserRouter>
                <SignOut registerUser={jest.fn()}/>
            </BrowserRouter>
        );
        expect(screen.getByTestId('sign-out-header')).toBeInTheDocument();
    });
})