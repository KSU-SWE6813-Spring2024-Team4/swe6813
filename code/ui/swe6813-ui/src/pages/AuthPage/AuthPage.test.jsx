import { render, screen } from '@testing-library/react';
import AuthPage from './AuthPage';
import { BrowserRouter } from 'react-router-dom';

describe('Main Auth Page Tests', () => {
    test('render main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
    });
})