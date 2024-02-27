import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../../../util/Api';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import '../../../../index.css';

const Text = styled.div`
    font-size: 12px;
    padding-top:10px;
`;

const SignUpText = styled.span`
    color: #0B4F6C;
    cursor: pointer;
`;

const ForgotPassword = styled.div`
    font-size: 12px;
    padding-left: 15px;
    text-align: right;
    padding-right: 3px;
    color:#BB0000;
    padding-bottom: 30px;
    cursor: pointer;
`;

const Header = styled.h1`
    font-size: 40px;
    padding-bottom: 0px;
    margin: 0px;
`;

function LoginBox({ onRegisterClick, onForgotPassClick }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    const navigate = useNavigate();

    const onUsernameChange = useCallback((newUsername) => {
        setUsername(newUsername)
    }, [setUsername])

    const onPasswordChange = useCallback((newPassword) => {
        setPassword(newPassword)
    }, [setPassword])

    const onLogin = useCallback(() => {
        if (username.length === 0 || password.length === 0) {
            return
        }

        login({ username, password })
            .then(() => navigate('/'))
            .catch(console.log)

    }, [navigate, password, username]);

    return (
        <>
            <Header data-testid="login-header" className="audiowide-regular">Login</Header>
            <Input label="Username" onChange={onUsernameChange} />
            <Input label="Password" onChange={onPasswordChange} />
            <ForgotPassword data-testid="forgot-pass-link" className="roboto-regular" onClick={onForgotPassClick}>Forgot Password</ForgotPassword>
            <Button onClick={ onLogin } title="Log In"/>
            <Text className="roboto-regular">
                Don't have an account?&nbsp;
                <SignUpText data-testid="sign-up-login" onClick={ onRegisterClick }>Create one here.</SignUpText>
            </Text>
        </>
    );
}

LoginBox.propTypes = {
    onRegisterClick: PropTypes.func.isRequired
}

export default LoginBox;
