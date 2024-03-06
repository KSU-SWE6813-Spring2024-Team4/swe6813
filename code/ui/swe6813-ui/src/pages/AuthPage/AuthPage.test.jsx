import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthPage from './AuthPage';
import { BrowserRouter } from 'react-router-dom';

describe('Main Auth Page Tests', () => {
    test('that it logs in user', () => {
        // TODO: WIP
    });

    test('render main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
    });

    test('render sign up page from main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
        expect(screen.getByTestId('sign-up-login')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('sign-up-login'));
        waitFor(() => {
            expect(screen.getByTestId('sign-up-header')).toBeInTheDocument();
        });
    });

    test('render sign up page going back to login from main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
        expect(screen.getByTestId('sign-up-login')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('sign-up-login'));
        waitFor(() => {
            expect(screen.getByTestId('sign-up-header')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('sign-up-sign-up'));
        waitFor(() => {
            expect(screen.getByTestId('login-header')).toBeInTheDocument();
        });
    });

    test('render forgot password page from main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
        expect(screen.getByTestId('forgot-pass-link')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('forgot-pass-link'));
        waitFor(() => {
            expect(screen.getByTestId('forgot-password-header')).toBeInTheDocument();
        });
    });

    test('render forgot password page back to login from main auth page', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
        expect(screen.getByTestId('auth-box')).toBeInTheDocument();
        expect(screen.getByTestId('forgot-pass-link')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('forgot-pass-link'));
        waitFor(() => {
            expect(screen.getByTestId('forgot-password-header')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('sign-up-forgot-pass'));
        waitFor(() => {
            expect(screen.getByTestId('login-header')).toBeInTheDocument();
        });
    });

})