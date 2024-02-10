import styled, { createGlobalStyle } from 'styled-components';
import SignUpBox from '../../components/SignUpBox/SignUpBox';
import LoginBox from '../../components/LoginBox/LoginBox';
import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

const GlobalStyle = createGlobalStyle`
    body {
        width: 100%;
        margin: 0;
        font-family: Courier New;
        position: relative;
    }

    body::after {
        content: '';
        position: fixed;
        top: 0;
        right: 0;
        width: 33%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(22, 160, 133, 0.52), rgba(52, 152, 219, 0.73));
    }
`;

const Box = styled.div`
    width: 300px;
    height: 300px;
    background-color: #FFF;
    box-shadow: 10px 10px 10px 10px #000;
`;

const LoginButton = styled.button`
    width: 100%;
    margin: 0;
`;

const TitleHeader = styled.h1`
    border: none;
`

function AuthPage () {
    // TODO: actually check for a real user session
    const [user, setUser] = useState(null);

    const [activeBox, setActiveBox] = useState('LOGIN')

    const navigate = useNavigate();

    const loginUser = useCallback(() => {
        // TODO: actually login the user before navigating to root app
        navigate("/");

        // setLogin(false)
    }, [navigate]);

    const registerUser = useCallback(() => {
        // TODO: actually register the user
    }, [])

    const changeBox = useCallback((box) => {
        setActiveBox(box)
    }, [setActiveBox])

    let title = ''
    switch (activeBox) {
        case 'LOGIN':
            title = "Welcome! Login to Begin"
            break
        case 'REGISTER':
            title = "Welcome! Register Here "
            break
        default:
            title = "Welcome"
    }

    return (
        <div>
            <GlobalStyle />
            {user && (
                <Navigate to="/" replace={true} />
            )}

            <TitleHeader>{ title }</TitleHeader>

            {/* TODO: REMOVE just three references */}
            {/* <button onClick={loginUser}>Log In</button>  */}

            { activeBox === 'LOGIN' && (
                // {/* TODO: actually hook up the login box up to design */}
                <LoginBox onRegisterClick={() => changeBox('REGISTER')} loginUser={loginUser}/>
            ) }
            { activeBox === 'REGISTER' && (
                // {/* TODO: actually hook up the login box up to design */}
                <SignUpBox onLoginClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
            ) }


            {/* <Box>
            {isLogin && 
                    <Login loginUser={loginUser} />
            }
            {!isLogin && 
                    <SignUp /> 
            }
            </Box> */}
        </div>
    );
}

export default AuthPage;