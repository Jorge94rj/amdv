import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
  grid-auto-rows: minmax(100px, auto);
`;
