import React, { ReactNode, useContext, useState } from "react";

interface IHistoryContext {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (value: boolean) => void;
}

const HistoryContext = React.createContext<IHistoryContext>(
  {} as IHistoryContext,
);

// custom hook to expose the HistoryContext
export function useHistory() {
  return useContext(HistoryContext);
}

interface Props {
  children: ReactNode;
}

export function HistoryProvider({ children }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  return (
    <HistoryContext.Provider
      value={{
        isHistoryOpen: isHistoryOpen,
        setIsHistoryOpen: setIsHistoryOpen,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
