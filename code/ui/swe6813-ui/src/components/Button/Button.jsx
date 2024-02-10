import styled from 'styled-components'

const StyledButton = styled.button`
  width: 100%;
  background-color: #0B4F6C;
  color: white;
  font-weight: 500;
  border: none;
  padding: 12px;
  margin: 10px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 16px;
  border: 2px solid transparent;
  transition: 0.3s ease;
  font-family: Courier New;
  font-weight: bold;
  letter-spacing: 1.5px;
`

export default function Button ({ title, onClick }) {
  return (
    <StyledButton onClick={onClick}>{ title }</StyledButton>
  )
}