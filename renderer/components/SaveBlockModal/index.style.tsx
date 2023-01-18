import styled from 'styled-components';

export const ContentWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 320px);

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

export const PathSelector = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  border-style: dashed solid;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  label {
    color: gray;
    font-size: 12px;
  }
  input {
    display: none
  }
`;