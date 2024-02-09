import styled from 'styled-components';
import SignUp from '../../components/SignUp/SignUp';
import Login from '../../components/Login/Login';
import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

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
            title = "Log In"
            break
        case 'REGISTER':
            title = "Register"
            break
        default:
            title = ""
    }

    return (
        <div>
            {user && (
                <Navigate to="/" replace={true} />
            )}

            <TitleHeader>{ title }</TitleHeader>

            {/* TODO: REMOVE just three references */}
            {/* <button onClick={loginUser}>Log In</button>  */}

            { activeBox === 'LOGIN' && (
                // {/* TODO: actually hook up the login box up to design */}
                <div>
                    <Button onClick={loginUser} title="Log In"/>
                    <div onClick={() => changeBox('REGISTER')}>Create account here</div>
                </div>
            ) }
            { activeBox === 'REGISTER' && (
                // {/* TODO: actually hook up the login box up to design */}
                <Button onClick={registerUser} title="Register"/>
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