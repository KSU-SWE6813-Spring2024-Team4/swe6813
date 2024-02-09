import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: #0B4F6C;
  color: white;
`

export default function Button ({ title, onClick }) {
  return (
    <StyledButton onClick={onClick}>{ title }</StyledButton>
  )
}