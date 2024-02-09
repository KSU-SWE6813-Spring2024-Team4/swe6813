import styled from 'styled-components';
import SignUp from '../../components/SignUp/SignUp';
import Login from '../../components/Login/Login';
import { useState, useCallback } from 'react';

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

function LoginWindow () {
    const [isLogin, setLogin] = useState(true);

    const loginUser = useCallback(() => {
        setLogin(false)
    });

    return (
    <div>
        <Box>
        {isLogin && 
                <Login loginUser={loginUser} />
        }
        {!isLogin && 
                <SignUp /> 
        }
        </Box>
    </div>
    );
}

export default LoginWindow;