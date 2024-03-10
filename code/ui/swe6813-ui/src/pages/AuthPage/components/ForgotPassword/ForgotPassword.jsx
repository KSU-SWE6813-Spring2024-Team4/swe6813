import styled from 'styled-components';
import Button from '../../../../components/Button/Button';
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

const Header = styled.h1`
    font-size: 40px;
    padding-bottom: 0px;
    margin: 0px;
`;

function ForgotPassword({ onReturnClick }) {
    return (
        <form>
            <Header data-testid="forgot-password-header" 
                className="audiowide-regular">Forgot Password</Header>
            <InputField>
                <InputElement className="roboto-regular" type="text" required/>
                <Label className="electrolize-regular">Email Address</Label>
            </InputField>
            {/* <Button onClick={registerUser} title="Get Verification Email"/> */}
            <Text className="roboto-regular">Remembered your password? <SignUpText data-testid="sign-up-forgot-pass" onClick={onReturnClick}>Sign in</SignUpText></Text>
        </form>
    );
}

export default ForgotPassword;