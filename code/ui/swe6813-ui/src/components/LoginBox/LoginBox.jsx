import styled from 'styled-components';
import PropTypes from 'prop-types';

function LoginBox({loginUser}) {
    //You can write html within the return()
    return (
        <div>
            <h1>Login page</h1>  
            <button onClick={loginUser}></button>
        </div>
    );
};
LoginBox.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default LoginBox;