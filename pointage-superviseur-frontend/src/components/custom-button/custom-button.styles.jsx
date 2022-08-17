import styled, { css } from 'styled-components';

const buttonStyles = css`
  background-color: #26AD90;
  color: white;
  border: none;
  &:hover {
    background-color: white;
    color: #26AD90;
    border: 1px solid #26AD90;
  }
`;

const invertedButtonStyles = css`
  background-color: white;
  color: black;
  border: 1px solid black;
  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`;


const getButtonStyles = props => {
  return props.inverted ? invertedButtonStyles : buttonStyles;
};

export const CustomButtonContainer = styled.button`
  min-width: 165px;
  width: auto;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0;
  font-size: 15px;
  text-transform: uppercase;
  font-family: 'Open Sans Condensed';
  font-weight: bolder;
  cursor: pointer;
  display: flex;
  justify-content: center;
  ${getButtonStyles}
`;