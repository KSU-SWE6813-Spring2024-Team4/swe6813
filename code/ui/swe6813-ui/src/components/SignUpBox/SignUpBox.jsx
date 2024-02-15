import styled from 'styled-components';
import Button from '../Button/Button';
import Input from '../Input/Input';

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

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
    width: 400px;
    border-radius: 8px;
    padding: 30px;
    text-align: left; 
    border: 1px solid;
    box-shadow: 5px 10px 18px gray;
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blue(9px);
`;

const Text = styled.div`
    font-size: 12px;
    padding-left: 15px;
`;

const Header = styled.h1`
    font-size: 29px;
    padding-bottom: 0px;
`;

const UnorderedList = styled.div`
    font-size: 10px;
    padding-left: 5px;
    line-height: 2;
`;
function SignUpBox({registerUser, onLoginClick}) {
    return (
        <>
        <form>
            <Header>Sign Up</Header>
            <InputField>
                <InputElement type="text" required/>
                <Label>Email Address</Label>
            </InputField>
            <InputField>
                <InputElement type="password" required/>
                <Label>Password</Label>
            </InputField>
            <InputField>
                <InputElement type="password" required/>
                <Label>Re-type Password</Label>
            </InputField>
            <UnorderedList>
            <ul>
                <li>Password matches re-type Password</li>
                <li>Password has at least one Uppercase and one Lowercase letter</li>
                <li>Password is between 8 and 16 characters</li>
                <li>Password contains one symbol (!.;-=+*#$@%^&())</li>
            </ul>
            </UnorderedList>
            <Button onClick={registerUser} title="Register"/>
            <Text onClick={onLoginClick}>Already have an account? Sign in</Text>
        </form>
        </>
    );
}

export default SignUpBox;