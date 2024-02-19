import styled from 'styled-components';
import Button from '../../../../components/Button/Button';

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

const UnorderedList = styled.div`
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

function SignUpBox({registerUser, onLoginClick}) {
    return (
        <form>
            <Header data-testid="sign-up-header" className="audiowide-regular">Sign Up</Header>
            <InputField>
                <InputElement className="roboto-regular" type="text" required/>
                <Label className="electrolize-regular">Email Address</Label>
            </InputField>
            <InputField>
                <InputElement className="roboto-regular" type="password" required/>
                <Label className="electrolize-regular">Password</Label>
            </InputField>
            <InputField>
                <InputElement className="roboto-regular" type="password" required/>
                <Label className="electrolize-regular">Re-type Password</Label>
            </InputField>
            <UnorderedList className="roboto-regular">
                <ul>
                    <li>Password matches re-type Password</li>
                    <li>Password has at least one Uppercase and one Lowercase letter</li>
                    <li>Password is between 8 and 16 characters</li>
                    <li>Password contains one symbol (!.;-=+*#$@%^&())</li>
                </ul>
            </UnorderedList>
            <Button onClick={registerUser} title="Register"/>
            <Text className="roboto-regular">Already have an account? <SignUpText data-testid="sign-up-sign-up" onClick={onLoginClick}>Sign in</SignUpText></Text>
        </form>
    );
}

export default SignUpBox;