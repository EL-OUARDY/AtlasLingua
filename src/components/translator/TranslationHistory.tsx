import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useHistory } from "@/contexts/HistoryContext";

import HistorySkeleton from "../skeletons/HistorySkeleton";
import { useUser } from "@/contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { ITranslationHistoryFetchDataResult } from "@/services/historyService";
import { cn } from "@/lib/utils";
import HistoryCard from "../HistoryCard";
import { useEffect } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

function TranslationHistory() {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    historyList,
    loadHistory,
    isLoading,
    deleteHistory,
    clearAllHistory,
  } = useHistory();

  const { user } = useUser();
  const navigate = useNavigate();

  // load user history
  useEffect(() => {
    if (user && historyList.length === 0 && isHistoryOpen) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isHistoryOpen]);

  function showHistory(history: ITranslationHistoryFetchDataResult) {
    setIsHistoryOpen(false);
    // send state data through route
    navigate(ROUTES.translate.index, {
      replace: true,
      state: { history: history },
    });
  }

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            History
          </SheetTitle>
          <SheetDescription>Your Recent Translation History</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-auto px-4 sm:px-6">
          <div className="flex h-full w-full flex-col items-start gap-4 py-4">
            {!user ? (
              <div className="flex size-full items-center justify-center text-center">
                <div className="flex flex-col gap-4">
                  <p className="">
                    Please log in to maintain a record <br /> of your activity.
                  </p>
                  <Link
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "w-full",
                    )}
                    to={ROUTES.login}
                  >
                    Login
                  </Link>
                </div>
              </div>
            ) : isLoading ? (
              Array(5)
                .fill(null)
                .map((_, index) => <HistorySkeleton key={index} />)
            ) : (
              historyList.map((item, index) => (
                <HistoryCard
                  key={index}
                  item={item}
                  showHistory={showHistory}
                  deleteHistory={deleteHistory}
                />
              ))
            )}
            {user && historyList.length == 0 && !isLoading && (
              <div className="flex size-full items-center justify-center text-center">
                <p>Your translation history will be recorded here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="px-4 pb-4 sm:px-6 sm:pb-6">
          <SheetClose asChild>
            {user && historyList.length > 0 && !isLoading && (
              <ConfirmationDialog
                title="Are you absolutely sure?"
                description="This action cannot be undone! This will permanently delete your account translation history."
                onOK={clearAllHistory}
              >
                <div
                  className={
                    buttonVariants({ variant: "default" }) + " cursor-pointer"
                  }
                >
                  Clear history
                </div>
              </ConfirmationDialog>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TranslationHistory;
