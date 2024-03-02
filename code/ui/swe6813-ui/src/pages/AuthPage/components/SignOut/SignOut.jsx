import styled from 'styled-components';
import Button from '../../../../components/Button/Button';
import '../../../../index.css';

const Text = styled.div`
    font-size: 12px;
    padding-top:10px;
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