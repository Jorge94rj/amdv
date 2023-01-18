import styled from 'styled-components';

export const AssetList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 32px;
  grid-auto-rows: minmax(100px, auto);
  margin-top: 16px;
`;

export const AssetItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: end;
`;

export const ButtonDelete = styled.button`
  cursor: pointer;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  svg {
    margin-top: 4px;
    margin-left: -2px;
  }
`;