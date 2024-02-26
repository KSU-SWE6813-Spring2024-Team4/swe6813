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

function SignOut( {registerUser} ) {
    return (
        <form>
            <Header data-testid="sign-out-header" className="audiowide-regular">Signed Out</Header>
            <Text>You have successfully logged out!</Text>
            <Button onClick={registerUser} title="Sign In"/>
        </form>
    );
}

export default SignOut;