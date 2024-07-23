import {
  Calendar,
  ChevronDownIcon,
  Copy,
  Expand,
  Flag,
  ListCollapse,
  ShieldCheck,
  StarIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import WTooltip from "./ui/custom/WTooltip";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

interface Props {
  favorite: IFavorite;
  className?: string;
  removeFavorite: (id: number) => void;
}

function FavoriteCard({ favorite, className, removeFavorite }: Props) {
  return (
    <Card className={className}>
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center text-xl leading-tight">
            {favorite.darija}
            <Expand className="ml-2 h-4 w-4 cursor-pointer" />
          </CardTitle>
          <CardDescription className="first-word-cap">
            <span className="font-bold text-orange-500">
              {favorite.english}
            </span>{" "}
            <br />
            {favorite.word_type && (
              <div className="text-sm capitalize text-muted-foreground">
                ({favorite.word_type})
              </div>
            )}
            {favorite.arabic}
          </CardDescription>
          <div className="absolute right-4 top-4 !m-0 flex h-fit items-center justify-between gap-2 rounded-md bg-secondary px-4 text-secondary-foreground">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Link
                  to="#"
                  className={
                    buttonVariants({ variant: "secondary" }) +
                    " !p-0 shadow-none"
                  }
                >
                  <WTooltip side="top" content="Remove from list">
                    <StarIcon className="size-4 cursor-pointer fill-orange-600 stroke-orange-500" />
                  </WTooltip>
                </Link>
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
                    onClick={() => removeFavorite(favorite.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="p-0 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className=""
                forceMount
              >
                <DropdownMenuItem className="cursor-pointer">
                  <ListCollapse className="mr-2 h-4 w-4" /> Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${favorite.english} = ${favorite.darija}`,
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

                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" /> Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between space-x-4 text-sm text-muted-foreground">
          {favorite.created_at && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
              {formatDistanceToNow(favorite.created_at, { addSuffix: true })}
            </div>
          )}
          <div className="flex items-center gap-2">
            {favorite.verified && (
              <WTooltip side="top" content="Verified by <br /> the community">
                <ShieldCheck className="size-4 text-green-600" />
              </WTooltip>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FavoriteCard;
