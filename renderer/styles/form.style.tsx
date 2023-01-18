import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 128px;
`;

export const RowItem = styled.div`
  display: flex;
  margin: 8px;
  color: #0099cc;
  input, select {
    width: 100%;
    height: 32px;
    border: 1px solid #cccccc;
    border-radius: 4px;
  }
`;

export const Legend = styled.div`
  color: #a4aab3;
  font-size: 14px;
  // font-weight: bold;
  padding: 8px;
`

export const Remark = styled.strong`
  // color: #eb1580;
  font-size: 16px;
`

export const LinkWrapper = styled.div`
  color: #0099cc;
  text-align: right;
  margin-top: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const Footer = styled.div`
  margin: 32px 8px;
  display: flex;
  flex-direction: column;

  p {
    font-size: 16px;
    text-align: right;
  }
`;

export const Button = styled.button<{inverse?: boolean}>`
  margin-top: 8px;
  width: 96px;
  height: 32px;
  background: none;
  border: 2px solid #0099cc;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;

  svg {
    display: flex;
  }

  &:hover {
    color: #fff;
    background: #0099cc;
    ${({inverse}) => inverse ? 'color: #fff !important;': ''}
  }

  &:enabled {
    ${({inverse}) => inverse ? 'color: #0099cc;': ''}
  }

  &:disabled {
    color: white;
    border: none;
    background-color: #cccccc;
  }
`;