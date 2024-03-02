import PropTypes from 'prop-types';
import { useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
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

function Input({ label, onChange, type = 'text' }) {
  const changeHandler = useCallback(({ target }) => {
    onChange(target.value)
  }, [onChange])

  return (
    <Container>
      <InputElement
        className="roboto-regular" 
        type={type} 
        onChange={changeHandler} 
        required
      />
      <Label className="electrolize-regular">{label}</Label>
    </Container>
  )
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
}

export default Input;