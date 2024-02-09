import styled from 'styled-components';
import PropTypes from 'prop-types';

function Login({loginUser}) {
    return (
        <div>
            <h1>Login page</h1>  
            <button onClick={loginUser}></button>
        </div>
    );
};
Login.propTypes = {
    loginUser: PropTypes.func.isRequired
}

export default Login;