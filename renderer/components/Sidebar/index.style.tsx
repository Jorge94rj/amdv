import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  height: 22vh;
  flex-direction: column;
  padding: 16px;
  h3 {
    margin: 0;
  }
`

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

export const RowSection = styled.div`
  display: flex;
  flex-direction: row;
  button {
    margin: 12px 8px 0px 0;
  }
`;

export const ChannelList = styled.div`
  display: block;
  flex-direction: column;
  height: 78vh;
  overflow-y: auto;
`

export const ChannelItem = styled.div<{active?:boolean}>`
  display: flex;
  width: calc(100% - 8px);
  height: 48px;
  border: 2px solid #cccccc;
  margin: 8px 4px;
  padding: 0px 8px;
  align-items: center;
  cursor: pointer;
  :hover {
    color: #fff;
    border-color: #fff;
  }
  ${
    ({active}) => active ? 
    `
      border: none;
      background: #000;
    ` 
    : ''
  }
`