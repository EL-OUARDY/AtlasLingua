import {
  Calendar,
  Check,
  Copy,
  ExpandIcon,
  ShieldCheck,
  StarOffIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Textarea } from "./ui/textarea";
import { isRTL } from "@/lib/utils";

interface Props {
  favorite: IFavorite;
  className?: string;
  removeFavorite: (id: number) => void;
}

function FavoriteCard({ favorite, className, removeFavorite }: Props) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Card className={cn(className, "flex flex-col justify-between")}>
        <CardHeader className="flex flex-1 flex-row gap-4 space-y-0 p-4">
          <div className="flex flex-1 flex-col">
            <CardTitle
              className="line-clamp-2 cursor-pointer text-lg leading-tight"
              onClick={() => {
                setFavoriteDialogOpen(true);
              }}
            >
              {favorite.darija}
            </CardTitle>
            <CardDescription className="flex flex-1 flex-col gap-2 first-word-cap">
              <span
                className="mt-1 line-clamp-2 cursor-pointer font-bold text-orange-500"
                onClick={() => {
                  setFavoriteDialogOpen(true);
                }}
              >
                {favorite.english}
              </span>{" "}
              {favorite.word_type && (
                <div className="text-sm capitalize text-muted-foreground">
                  <div className="">{favorite.word_type}</div>
                </div>
              )}
              <div className="">{favorite.arabic}</div>
              <div className="mt-auto flex items-center justify-between">
                {favorite.created_at && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
                    {formatDistanceToNow(favorite.created_at, {
                      addSuffix: true,
                    })}
                  </div>
                )}
                {favorite.verified && (
                  <div className="ml-auto">
                    <WTooltip
                      side="top"
                      content="Verified by <br /> the community"
                    >
                      <ShieldCheck className="size-4 text-green-600" />
                    </WTooltip>
                  </div>
                )}
              </div>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="border-t px-4 py-2">
          <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size={"icon"}
              className="border border-muted text-muted-foreground hover:text-foreground"
              onClick={() => {
                navigator.clipboard.writeText(favorite.darija);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              {!isCopied ? (
                <Copy className="size-4 cursor-pointer" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <WTooltip side="top" content="Remove from list">
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className="border border-muted text-muted-foreground hover:text-foreground"
                    >
                      <StarOffIcon className="size-4 cursor-pointer" />
                    </Button>
                  </WTooltip>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12 rounded-lg sm:w-[450px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove the selected item from your
                    favorites list. it will no longer appear here.
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
            <div className="ml-auto">
              <WTooltip side="top" content="Expand">
                <Button
                  variant="ghost"
                  size={"icon"}
                  className="border border-muted text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setFavoriteDialogOpen(true);
                  }}
                >
                  <ExpandIcon className="size-4 cursor-pointer" />
                </Button>
              </WTooltip>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* entry dialog */}
      {favoriteDialogOpen && (
        <Dialog open={favoriteDialogOpen} onOpenChange={setFavoriteDialogOpen}>
          <DialogContent className="w-11/12 rounded-lg sm:w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Favorite</DialogTitle>
              <DialogDescription>
                Saved:{" "}
                {favorite.created_at &&
                  formatDistanceToNow(favorite.created_at, {
                    addSuffix: true,
                  })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Accordion
                type="multiple"
                className="w-full"
                defaultValue={["english", "darija"]}
              >
                <AccordionItem value="english">
                  <AccordionTrigger className="!outline-none">
                    English
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      readOnly
                      value={favorite.english}
                      className="text-foreground first-word-cap no-ring"
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="darija">
                  <AccordionTrigger className="!outline-none">
                    Darija
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      readOnly
                      value={favorite.darija}
                      className="text-foreground no-ring"
                      dir={isRTL(favorite.darija) ? "rtl" : "ltr"}
                    />
                    {favorite.word_type && (
                      <div className="mt-2 flex items-center gap-2 capitalize">
                        <h3>Word type:</h3>
                        <div className="text-sm text-muted-foreground">
                          {favorite.word_type}
                        </div>

                        {favorite.verified && (
                          <div className="ml-auto">
                            <WTooltip
                              side="top"
                              content="Verified by <br /> the community"
                            >
                              <ShieldCheck className="size-4 text-green-600" />
                            </WTooltip>
                          </div>
                        )}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {favorite.arabic && (
                  <AccordionItem value="arabic">
                    <AccordionTrigger className="!outline-none">
                      Arabic Letters
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        readOnly
                        value={favorite.arabic}
                        className="text-foreground no-ring"
                        dir="rtl"
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
            <DialogFooter>
              {/* <Button type="submit">Hide</Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default FavoriteCard;
