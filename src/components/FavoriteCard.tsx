import { Calendar, Check, Copy, ShieldCheck, StarOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import WTooltip from "./ui/custom/WTooltip";
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
} from "./ui/alert-dialog";
import { IFavorite } from "@/services/favoriteService";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  favorite: IFavorite;
  className?: string;
  removeFavorite: (id: number) => void;
}

function FavoriteCard({ favorite, className, removeFavorite }: Props) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  return (
    <Card className={cn(className, "flex flex-col justify-between")}>
      <CardHeader className="flex flex-1 flex-row gap-4 space-y-0 p-4">
        <div className="flex flex-1 flex-col">
          <CardTitle className="line-clamp-2 cursor-pointer text-lg leading-tight">
            {favorite.darija}
          </CardTitle>
          <CardDescription className="flex flex-1 flex-col gap-2 first-word-cap">
            <span className="line-clamp-2 cursor-pointer font-bold text-orange-500">
              {favorite.english}
            </span>{" "}
            {favorite.word_type && (
              <div className="text-sm capitalize text-muted-foreground">
                <div className="">{favorite.word_type}</div>
              </div>
            )}
            <div className="">{favorite.arabic}</div>
            {favorite.created_at && (
              <div className="mt-auto flex items-center">
                <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
                {formatDistanceToNow(favorite.created_at, { addSuffix: true })}
              </div>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="border-t px-4 py-2">
        <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size={"icon"}
            className="border border-muted"
            onClick={() => {
              navigator.clipboard.writeText(favorite.darija);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {!isCopied ? (
              <Copy className="size-4 text-muted-foreground" />
            ) : (
              <Check className="size-4 text-muted-foreground" />
            )}
            <span className="sr-only">Copy</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div>
                <WTooltip side="top" content="Remove from list">
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="border border-muted"
                  >
                    <StarOffIcon className="size-4 cursor-pointer text-muted-foreground" />
                  </Button>
                </WTooltip>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-11/12 rounded-lg sm:w-[450px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove the selected item from your favorites
                  list. it will no longer appear here.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeFavorite(favorite.id as number)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {favorite.verified && (
            <div className="ml-auto">
              <WTooltip side="top" content="Verified by <br /> the community">
                <Button
                  variant="ghost"
                  size={"icon"}
                  className="cursor-default border border-muted"
                >
                  <ShieldCheck className="size-4 text-green-600" />
                </Button>
              </WTooltip>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FavoriteCard;
