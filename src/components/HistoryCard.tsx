import { formatDistanceToNow } from "date-fns";
import { Expand, Calendar, Copy, Trash2, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ITranslationHistoryFetchDataResult } from "@/services/historyService";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

interface Props {
  item: ITranslationHistoryFetchDataResult;
  showHistory: (item: ITranslationHistoryFetchDataResult) => void;
  deleteHistory: (id: number) => void;
}

function HistoryCard({ item, showHistory, deleteHistory }: Props) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  return (
    <Card className="w-full">
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-4">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center gap-2 text-base leading-tight sm:text-lg">
            <div className="mr-auto line-clamp-2">
              <p
                className={
                  item.source_language === "english" ? "first-word-cap" : ""
                }
              >
                {item.source_language === "english"
                  ? item.english
                  : item.darija}
              </p>
            </div>
            <div className="">
              <Expand
                onClick={() => showHistory(item)}
                className="size-4 cursor-pointer text-secondary-foreground"
              />
            </div>
          </CardTitle>
          <CardDescription className="">
            <span className="line-clamp-2 font-bold text-orange-500">
              <p
                className={
                  item.source_language === "darija" ? "first-word-cap" : ""
                }
              >
                {item.source_language === "english"
                  ? item.darija
                  : item.english}
              </p>
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-4">
        <div className="flex items-center justify-between space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
            {formatDistanceToNow(item.created_at, {
              addSuffix: true,
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="">
              {!isCopied ? (
                <Copy
                  onClick={() => {
                    navigator.clipboard.writeText(
                      item.source_language === "english"
                        ? item.darija
                        : item.english,
                    );
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="size-4 cursor-pointer hover:text-primary"
                />
              ) : (
                <Check className="size-4 hover:text-primary" />
              )}
            </div>
            <ConfirmationDialog
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently erase your selected history records."
              onOK={() => deleteHistory(item.id)}
            >
              <Trash2 className="size-4 cursor-pointer hover:text-primary" />
            </ConfirmationDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default HistoryCard;
