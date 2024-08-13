import historyService, {
  ITranslationHistoryFetchDataResult,
} from "@/services/historyService";
import { CanceledError } from "axios";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface IHistoryContext {
  historyList: ITranslationHistoryFetchDataResult[];
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
  const [historyList, setHistoryList] = useState<
    ITranslationHistoryFetchDataResult[]
  >([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    setIsloading(true);
    const { request, cancel } = historyService.get_history();

    request
      .then(({ data }) => {
        setHistoryList(data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
      })
      .finally(() => {
        setIsloading(false);
      });

    return () => cancel();
  }, []);

  function deleteHistory(history_id: number) {
    const { request } = historyService.delete_history(history_id);

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
    const { request } = historyService.clear_all_history();
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
    const newHistory: ITranslationHistoryFetchDataResult = {
      id: id,
      english: english,
      darija: darija,
      source_language: source_language,
      created_at: new Date().toISOString(),
      shareable_link: shareable_link,
    };

    setHistoryList([newHistory, ...historyList]);

    return;
  }

  return (
    <HistoryContext.Provider
      value={{
        historyList,
        isHistoryOpen,
        setIsHistoryOpen,
        isLoading,
        deleteHistory,
        clearAllHistory,
        addToHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
