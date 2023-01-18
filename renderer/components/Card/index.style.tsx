import styled from 'styled-components'

export const CardContainer = styled.div<{ clickable?: boolean }>`
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #cccccc;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;

  ${({ clickable }) => clickable
    ? `
      cursor: pointer;
      &:hover {
        border: 1px solid #0099cc;
        color: #0099cc;
        img {
          filter: invert(43%) sepia(33%) saturate(760%) hue-rotate(48deg) brightness(95%) contrast(96%);
        }
      }
    `
    : ``
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
    color: gray;
  }
`

export const IconWrapper = styled.div<{noMargin?: boolean}>`
  display: flex;
  width: 100%;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  ${
    ({noMargin}) => noMargin
    ? ''
    : 'margin-top: 28px;'
  }
  
  input {
    display: none;
  }

  svg {
    border-radius: 50%;
    background: #0099cc;
  }
`;