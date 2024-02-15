import styled from 'styled-components';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
import '../../index.css';

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

const Text = styled.div`
    font-size: 12px;
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
    padding-bottom: 0px;
`;
function LoginBox({loginUser,onRegisterClick}) {
    return (
        <>
            <FormContainer>
                <form>
                    <Header className="audiowide-regular">Login</Header>
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
        </>
    );
}

LoginBox.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default LoginBox;
