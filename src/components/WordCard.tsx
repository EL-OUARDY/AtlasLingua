import {
  ChevronDownIcon,
  CircleIcon,
  Copy,
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
import { IDictionary } from "@/models/Dictionary";
import WTooltip from "./ui/custom/WTooltip";
import { toast } from "sonner";

interface Props {
  word: IDictionary;
  className?: string;
  addFavorite: (word: IDictionary) => void;
  removeFavorite: (word: IDictionary) => void;
}

function WordCard({ word, className, addFavorite, removeFavorite }: Props) {
  return (
    <Card className={className}>
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center text-xl leading-tight">
            {word.darija}
          </CardTitle>
          <CardDescription className="first-word-cap">
            <span className="font-bold text-orange-500">{word.english}</span>{" "}
            <br />
            {word.arabic}
          </CardDescription>
          <div className="absolute right-4 top-4 !m-0 flex h-fit items-center justify-between gap-2 rounded-md bg-secondary px-4 text-secondary-foreground">
            <div
              className={
                buttonVariants({ variant: "secondary" }) + " !p-0 shadow-none"
              }
            >
              {word.favorite && (
                <>
                  <WTooltip side="top" content="Remove from list">
                    <StarIcon
                      onClick={() => removeFavorite(word)}
                      className="size-4 cursor-pointer fill-orange-600 stroke-orange-500"
                    />
                  </WTooltip>
                </>
              )}
              {!word.favorite && (
                <>
                  <WTooltip side="top" content="Save">
                    <StarIcon
                      onClick={() => addFavorite(word)}
                      className="size-4 cursor-pointer"
                    />
                  </WTooltip>
                </>
              )}
            </div>

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
                      `${word.english} = ${word.darija}`,
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
          {word.category && (
            <div className="flex items-center capitalize">
              <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 stroke-sky-400" />
              {word.category}
            </div>
          )}
          <div className="flex items-center gap-2">
            {word.verified && (
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

export default WordCard;
