import styled from "styled-components";

export const ActionHeader = styled.div`
  display: flex;
  // margin: 8px;
  button {
    margin: 0 12px 0 0;
  }
`;

export const BlockList = styled.div`
  // display: flex;
  display: block;
  overflow-y: auto;
  margin-top: 32px;
  width: 100%;
`;

export const BlockItem = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 48px;
  padding: 4px;
  margin-bottom: 8px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    color: #0099cc;
    background: #fff;
    border-color: #0099cc;
  }
`;

export const LeftContent = styled.div`
  display: flex;
  width: 100%;
  justify-conent: start;
  align-items: center;
  label {
    margin: 0 16px;
  }
  `;
  
  export const RightContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  align-items: center;
  label {
    margin: 0 16px;
  }
`;