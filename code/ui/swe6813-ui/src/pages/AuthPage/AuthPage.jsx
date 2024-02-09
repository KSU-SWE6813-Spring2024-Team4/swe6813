import styled from 'styled-components';
import SignUp from '../../components/SignUp/SignUp';
import Login from '../../components/Login/Login';
import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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

function AuthPage () {
    // TODO: actually check for a real user session
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const loginUser = useCallback(() => {
        // TODO: actually login the user before navigating to root app
        navigate("/");

        // setLogin(false)
    }, [navigate]);

    return (
        <div>
            {user && (
                <Navigate to="/" replace={true} />
            )}

            <h1>Auth screen</h1>
            <button onClick={loginUser}>Log In</button> 

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