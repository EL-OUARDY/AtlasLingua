import historyService, { IHistory } from "@/services/historyService";
import { CanceledError } from "axios";
import React, { ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

interface IHistoryContext {
  historyList: IHistory[];
  loadHistory: () => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (value: boolean) => void;
  deleteHistory: (history_id: number) => void;
  clearAllHistory: () => void;
  addToHistory: (
    id: number,
    english: string,
    darija: string,
    source_language: string,
    shareable_link: string,
  ) => void;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasMore: boolean;
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
  fetchLimit?: number;
}

export function HistoryProvider({ children, fetchLimit = 10 }: Props) {
  const [historyList, setHistoryList] = useState<IHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const [historyLoaded, setHistoryLoaded] = useState<boolean>(false);

  const [fetchPage, setFetchPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  function loadHistory() {
    setIsloading(true);
    const { request } = historyService.getHistory(fetchPage, fetchLimit);

    request
      .then(({ data }) => {
        setHistoryLoaded(true);
        setHistoryList((prev) => [...(prev || []), ...data.items]);
        setHasMore(fetchPage < data.pages);
        setFetchPage((prev) => prev + 1);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
      })
      .finally(() => {
        setIsloading(false);
      });
  }

  function deleteHistory(history_id: number) {
    const { request } = historyService.deleteHistory(history_id);

    // delete from history list
    const oldHistoryList = historyList;
    setHistoryList(historyList.filter((h) => h.id != history_id));

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // if unable to delete then return deleted to the list
      setHistoryList(oldHistoryList);

      toast("Can't perform the action, try again later.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function clearAllHistory() {
    const { request } = historyService.clearAllHistory();
    request
      .then(() => {
        setHistoryList([]);
        toast.success("History has been deleted.", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast("Can't perform the action, try again later.", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      });
  }

  function addToHistory(
    id: number,
    english: string,
    darija: string,
    source_language: string,
    shareable_link: string,
  ) {
    if (historyLoaded) {
      const newHistory: IHistory = {
        id: id,
        english: english,
        darija: darija,
        source_language: source_language,
        created_at: new Date().toISOString(),
        shareable_link: shareable_link,
      };

      setHistoryList([newHistory, ...historyList]);
    }
  }

  function fetchNextPage() {
    loadHistory();
  }

  return (
    <HistoryContext.Provider
      value={{
        historyList,
        loadHistory,
        isHistoryOpen,
        setIsHistoryOpen,
        isLoading,
        deleteHistory,
        clearAllHistory,
        addToHistory,
        fetchNextPage,
        hasMore,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
