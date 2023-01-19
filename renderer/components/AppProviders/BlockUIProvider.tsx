import React, { FC, ReactNode, useState, useContext, useEffect } from 'react';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export interface IBlockUIObj {
  blocking?: boolean;
  toggleBlocking: (blocking: boolean) => void;
}

type BlockUIProviderProps = {
  children: ReactNode;
};

const BlockUIContext = React.createContext<IBlockUIObj>({
  blocking: false,
  toggleBlocking: (blocking: boolean) => undefined,
});


const BlockUIProvider: FC<BlockUIProviderProps> = ({ children }) => {
  const [blocking, toggleBlocking] = useState(false);

  return (
    <BlockUIContext.Provider
      value={{
        blocking,
        toggleBlocking,
      }}
    >
      <BlockUi blocking={blocking}>
        {children}
      </BlockUi>
    </BlockUIContext.Provider>
  );
};

export default BlockUIProvider;

export const useBlockUI = (): IBlockUIObj => {
  return useContext(BlockUIContext);
};
