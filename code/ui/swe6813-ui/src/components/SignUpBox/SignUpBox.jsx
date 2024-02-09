import styled from 'styled-components';
import Button from '../Button/Button';

function SignUpBox({registerUser, onLoginClick}) {
    
    return (
        <div>
            <Button onClick={registerUser} title="Register"/>
            <div onClick={onLoginClick}>Sign in here</div>
        </div>
    );
}

export default SignUpBox;