import styled from 'styled-components';
import {
    useCallback,
    useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import { register } from '../../../../util/Api';

const Text = styled.div`
    font-size: 12px;
    padding-top:10px;
`;
const SignUpText = styled.span`
    color: #0B4F6C;
    cursor: pointer;
`;

const Rules = styled.div`
    font-size: 10px;
    padding-left: 5px;
    line-height: 2;
    padding-bottom: 30px;
`;

const Header = styled.h1`
    font-size: 40px;
    padding-bottom: 0px;
    margin: 0px;
`;

function SignUpBox({ onLoginClick }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")

    const navigate = useNavigate();

    const onUsernameChange = useCallback((newUsername) => {
        setUsername(newUsername)
    }, [setUsername])

    const onPasswordChange = useCallback((newPassword) => {
        setPassword(newPassword)
    }, [setPassword])

    const onConfirmedPasswordChange = useCallback((newConfirmedPassword) => {
        setConfirmedPassword(newConfirmedPassword)
    }, [setConfirmedPassword])

    const onRegister = useCallback(() => {
        const hasEmptyFields = username.length === 0 || password.length === 0 || confirmedPassword.length === 0
        const nonMatchingPasswords = password !== confirmedPassword
        if (hasEmptyFields || nonMatchingPasswords) {
            return
        }

        register({ username, password })
            .then(() => navigate('/'))
            .catch(console.log)
    }, [confirmedPassword, navigate, password, username])

    return (
        <>
            <Header data-testid="sign-up-header" className="audiowide-regular">Sign Up</Header>
            <Input label="Username" onChange={onUsernameChange} />
            <Input
                label="Password"
                onChange={onPasswordChange} 
                type='password'
            />
            <Input label="Confirm Password" onChange={onConfirmedPasswordChange} type='password'/>
            <Rules className="roboto-regular">
                <ul>
                    <li>Password matches re-type Password</li>
                    <li>Password has at least one Uppercase and one Lowercase letter</li>
                    <li>Password is between 8 and 16 characters</li>
                    <li>Password contains one symbol (!.;-=+*#$@%^&())</li>
                </ul>
            </Rules>
            <Button onClick={ onRegister } title="Register"/>
            <Text className="roboto-regular">
                Already have an account?&nbsp;
                <SignUpText data-testid="sign-up-sign-up" onClick={onLoginClick}>Sign in</SignUpText>
            </Text>
        </>
    );
}

export default SignUpBox;