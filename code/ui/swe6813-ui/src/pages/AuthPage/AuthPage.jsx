import styled from 'styled-components';
import SignUpBox from './components/SignUpBox/SignUpBox';
import LoginBox from './components/LoginBox/LoginBox';
import SignOut from './components/SignOut/SignOut';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ChangePassword from './components/ChangePassword/ChangePassword';
import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../index.css';

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
const Box = styled.div`
    margin: auto;
    width: 50%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding: 50px;
    background-color: #FFF;
    box-shadow: 0px 4px 4px 0px #444;
`;
const Header = styled.h1`
    font-size: 32px;
    padding-bottom: 0px;
`;
const LoginButton = styled.button`
    width: 100%;
    margin: 0;
`;

function AuthPage () {
    // TODO: actually check for a real user session
    const [user, setUser] = useState(null);

    const [activeBox, setActiveBox] = useState('LOGIN')

    const navigate = useNavigate();

    const loginUser = useCallback(() => {
        // TODO: actually login the user before navigating to root app
        navigate("/");

    }, [navigate]);

    const registerUser = useCallback(() => {
        // TODO: actually register the user
    }, [])

    const changeBox = useCallback((box) => {
        setActiveBox(box)
    }, [setActiveBox])

    

    return (
        <>
            <MainLoginContainer>
                {user && (
                    <Navigate to="/" replace={true} />
                )}

                {/* TODO: REMOVE just three references */}
                {/* <button onClick={loginUser}>Log In</button>  */}
                <Box data-testid="auth-box">
                    { activeBox === 'LOGIN' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <LoginBox onRegisterClick={() => changeBox('SIGNUP')} 
                            onForgotPassClick={() => changeBox('FORGOTPASSWORD')} 
                            loginUser={loginUser}/>
                    ) }
                    { activeBox === 'SIGNUP' && (
                        // {/* TODO: actually hook up the login box up to design */}
                            <SignUpBox onLoginClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
                    ) }
                    { activeBox === 'SIGNOUT' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <>
                            <SignUpBox onLoginClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
                        </>
                    ) }
                    { activeBox === 'CHANGEPASSWORD' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <>
                            <ChangePassword onReturnClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
                        </>
                    ) }
                    { activeBox === 'FORGOTPASSWORD' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <>
                            <ForgotPassword onReturnClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
                        </>
                    ) }
                </Box>
            </MainLoginContainer>
            <SideGraphicContainer></SideGraphicContainer>
        </>
    );
}

export default AuthPage;