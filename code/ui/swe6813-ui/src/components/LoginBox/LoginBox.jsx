import styled, { createGlobalStyle } from 'styled-components';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

const GlobalStyle = createGlobalStyle`
    body {
        font-family: Courier New;
        padding: 12px 20px;
        font-weight: bold;
        letter-spacing: 1.5px;
    }
`;

const InputField = styled.div`
    width: 97%;
    background: transparent;
    outline: none;
    font-size: 12px;
    color: #333;
    position: relative;
    border-bottom: 2px solid #ccc;
    margin: 40px 20px 40px 15px;
`;

const InputElement = styled.input`
    width: 99%;
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

const Password = styled.div`
    font-size: 12px;
    padding-left: 15px;
    text-align: right;
    padding-right: 3px;
    color:#8b0000;
    padding-bottom: 45px;
`;

const Header = styled.div`
    font-size: 29px;
    padding-left: 15px;
    padding-bottom: 0px;
`;
function LoginBox({loginUser,onRegisterClick}) {
    return (
        <>
            <GlobalStyle />
            <Wrapper className="wrapper">
                <FormContainer>
                    <form>
                        <Header>Login</Header>
                        <InputField>
                            <InputElement type="text" required/>
                            <Label>Email Address</Label>
                        </InputField>
                        <InputField>
                            <InputElement type="password" required/>
                            <Label>Password</Label>
                        </InputField>
                        <Password>Forgot Password</Password>
                        <Button onClick={loginUser} title="Log In"/>
                        <Text onClick={onRegisterClick}>Don't have an account? Create one here.</Text>
                    </form>
                </FormContainer>
            </Wrapper>
        </>
    );
}

LoginBox.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default LoginBox;
