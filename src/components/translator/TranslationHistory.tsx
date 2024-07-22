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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { formatDistanceToNow } from "date-fns";
import {
  Expand,
  Copy,
  Calendar,
  EllipsisVertical,
  Trash2,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import HistorySkeleton from "../skeletons/HistorySkeleton";
import { useUser } from "@/contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ITranslationHistoryFetchDataResult } from "@/services/historyService";
import { cn } from "@/lib/utils";

function TranslationHistory() {
  const {
    isHistoryOpen,
    setIsHistoryOpen,
    historyList,
    isLoading,
    deleteHistory,
    clearAllHistory,
  } = useHistory();

  const { user } = useUser();
  const navigate = useNavigate();

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
        <SheetHeader className="">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            History
          </SheetTitle>
          <SheetDescription>Your Recent Translation History</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-auto">
          <div className="flex h-full w-full flex-col items-start gap-4 py-4">
            {!user ? (
              <div className="flex size-full items-center justify-center text-center">
                <div className="flex flex-col gap-4">
                  <p className="">
                    Please login to keep track of your history.
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
                <Card key={index} className="w-full">
                  <CardHeader className="relative flex flex-row gap-4 space-y-0 p-2 sm:p-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="flex items-center gap-2 text-base leading-tight sm:text-lg">
                        <div className="mr-auto line-clamp-2">
                          <p
                            className={
                              item.source_language === "english"
                                ? "first-word-cap"
                                : ""
                            }
                          >
                            {item.source_language === "english"
                              ? item.english
                              : item.darija}
                          </p>
                        </div>
                        <div className="">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVertical className="size-4 cursor-pointer text-secondary-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              alignOffset={-5}
                              className=""
                              forceMount
                            >
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() => showHistory(item)}
                              >
                                <Expand className="mr-2 h-4 w-4" /> Show
                              </DropdownMenuItem>

                              <DropdownMenuItem className="cursor-pointer">
                                <Star className="mr-2 h-4 w-4" /> Save
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${item.english} = ${item.darija}`,
                                  );
                                  toast("Copied to clipboard", {
                                    action: {
                                      label: "Hide",
                                      onClick: () => {},
                                    },
                                  });
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" /> Copy
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardTitle>
                      <CardDescription className="">
                        <span className="line-clamp-2 font-bold text-orange-500">
                          <p
                            className={
                              item.source_language === "darija"
                                ? "first-word-cap"
                                : ""
                            }
                          >
                            {item.source_language === "english"
                              ? item.darija
                              : item.english}
                          </p>
                        </span>

                        {item.source_language}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex justify-between space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
                        {formatDistanceToNow(item.created_at, {
                          addSuffix: true,
                        })}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild className="">
                          <Trash2 className="mr-2 h-4 w-4 cursor-pointer" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteHistory(item.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {user && historyList.length == 0 && !isLoading && (
              <div className="flex size-full items-center justify-center text-center">
                <p>Your translation history will be recorded here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            {user && historyList.length > 0 && !isLoading && (
              <AlertDialog>
                <AlertDialogTrigger
                  className={buttonVariants({ variant: "default" })}
                >
                  Clear history
                </AlertDialogTrigger>
                <AlertDialogContent className="w-11/12">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone! This will permanently delete
                      your account translation history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllHistory}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TranslationHistory;
