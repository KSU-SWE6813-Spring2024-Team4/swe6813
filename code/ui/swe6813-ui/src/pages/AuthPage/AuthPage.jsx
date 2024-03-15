import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SignUpBox from './components/SignUpBox/SignUpBox';
import LoginBox from './components/LoginBox/LoginBox';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ChangePassword/ChangePassword';
import '../../index.css';
import { checkToken } from '../../util/Api';

const MainLoginContainer = styled.div`
    float: left;
    width: 61.8%;
    height: 100vh;
    background-color: #fff;
`;

const SideGraphicContainer = styled.div`
    float: right;
    width: 38.2%;
    height: 100vh;
    background-color: #fff;
    background-image: url("test-graphic.png");
    background-size: 100% 100%;
`;

const Container = styled.div`
    margin: auto;
    width: 50%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding: 50px;
    background-color: #FFF;
    box-shadow: 0px 4px 4px 0px #444;
`;

const Box = {
    Login: 'LOGIN',
    Signup: 'SIGNUP'
}

function AuthPage () {
    const [activeBox, setActiveBox] = useState(Box.Login);

    const navigate = useNavigate();

    const changeBox = useCallback((box) => {
        setActiveBox(box)
    }, [setActiveBox])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return
        }
        
        checkToken(token)
            .then((isValid) => {
                if (!isValid) {
                    localStorage.removeItem('token')
                    return
                }

                navigate('/')
            })
            // TODO: dispatch error modal action with message
            .catch(console.log)
    }, [])

    return (
        <>
            <MainLoginContainer>
                {/* TODO: REMOVE just three references */}
                <Container data-testid="auth-box">
                    { activeBox === Box.Login && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <LoginBox 
                            onRegisterClick={() => changeBox(Box.Signup)} 
                            onForgotPassClick={() => changeBox('FORGOTPASSWORD')} 
                        />
                    ) }
                    { activeBox === Box.Signup && (
                        <SignUpBox onLoginClick={() => changeBox(Box.Login)}/>
                    ) }
                    { activeBox === 'CHANGEPASSWORD' && (
                        <ChangePassword onReturnClick={() => changeBox(Box.Login)} />
                    ) }
                    { activeBox === 'FORGOTPASSWORD' && (
                        <ForgotPassword onReturnClick={() => changeBox(Box.Login)}/>
                    ) }
                </Container>
            </MainLoginContainer>
            <SideGraphicContainer/>
        </>
    );
}

export default AuthPage;