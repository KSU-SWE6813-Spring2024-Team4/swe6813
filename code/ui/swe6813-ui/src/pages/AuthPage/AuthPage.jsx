import styled from 'styled-components';
import SignUpBox from '../../components/SignUpBox/SignUpBox';
import LoginBox from '../../components/LoginBox/LoginBox';
import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../index.css';
import Button from '../../components/Button/Button';

const MainLoginContainer = styled.div`
    float: left;
    width: 61.8%;
    height: 100px;
    background-color:#129129
`;
const sideGraphicContainer = styled.div`
    float: right;
    width: 38.2%;
    height: 100px;
    background-color: #000;
`;
const Box = styled.div`
    margin: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    vertical-align: middle;
    padding: 50px;
    background-color: #FFF;
    box-shadow: 0px 4px 4px 0px #444;
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

        // setLogin(false)
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
                <Box>
                    { activeBox === 'LOGIN' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <LoginBox onRegisterClick={() => changeBox('REGISTER')} loginUser={loginUser}/>
                    ) }
                    { activeBox === 'REGISTER' && (
                        // {/* TODO: actually hook up the login box up to design */}
                        <SignUpBox onLoginClick={() => changeBox('LOGIN')} registerUser={registerUser}/>
                    ) }
                </Box>
            </MainLoginContainer>
            <sideGraphicContainer></sideGraphicContainer>
        </>
    );
}

export default AuthPage;