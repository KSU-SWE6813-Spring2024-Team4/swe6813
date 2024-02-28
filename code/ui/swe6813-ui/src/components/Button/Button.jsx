import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../index.css';

const StyledButton = styled.button`
  width: 100%;
  background-color: #0B4F6C;
  color: white;
  font-weight: 500;
  border: none;
  padding: 12px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 20px;
  border: 2px solid transparent;
  transition: 0.3s ease;
  letter-spacing: 1.5px;
`

function Button ({ title, onClick }) {
  return (
    <StyledButton className="electrolize-regular" onClick={onClick}>
      { title }
    </StyledButton>
  )
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button;