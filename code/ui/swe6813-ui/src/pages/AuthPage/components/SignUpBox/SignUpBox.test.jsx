import { render, screen } from '@testing-library/react';
import SignUpBox from './SignUpBox';
import { BrowserRouter } from 'react-router-dom';

describe('Main Auth Page Tests', () => {
    test('render main auth page', () => {
        render(
            <BrowserRouter>
                <SignUpBox />
            </BrowserRouter>
        );
        expect(screen.getByTestId('sign-up-header')).toBeInTheDocument();
    });
})