import styled from 'styled-components';
import Button from '../../../../components/Button/Button';
import PropTypes from 'prop-types';
import '../../../../index.css';

const InputField = styled.div`
    width: 100%;
    background: transparent;
    outline: none;
    font-size: 12px;
    color: #333;
    position: relative;
    border-bottom: 2px solid #ccc;
    margin: 40px 0px 40px 0px;
`;

const InputElement = styled.input`
    width: 100%;
    border: none;
    outline: none;
    font-size: 12px;
    color: #333;
`;

const Label = styled.div`
    color: black;
    font-size: 14px;
    position: absolute;
    top: 25px; 
`;

const Text = styled.div`
    font-size: 12px;
    padding-top:10px;
`;

const SignUpText = styled.span`
    color: #0B4F6C;
    cursor: pointer;
`;

const Password = styled.div`
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

function LoginBox({loginUser,onRegisterClick, onForgotPassClick}) {
    return (
        <form>
            <Header data-testid="login-header" className="audiowide-regular">Login</Header>
            <InputField>
                <InputElement className="roboto-regular" type="text" required/>
                <Label className="electrolize-regular">Email Address</Label>
            </InputField>
            <InputField>
                <InputElement className="roboto-regular" type="password" required/>
                <Label className="electrolize-regular">Password</Label>
            </InputField>
            <Password data-testid="forgot-pass-link" className="roboto-regular" onClick={onForgotPassClick}>Forgot Password</Password>
            <Button onClick={loginUser} title="Log In"/>
            <Text className="roboto-regular">Don't have an account? <SignUpText data-testid="sign-up-login" onClick={onRegisterClick}>Create one here.</SignUpText></Text>
        </form>
    );
}

LoginBox.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default LoginBox;
