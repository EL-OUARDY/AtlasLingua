import {
  Calendar,
  ChevronDownIcon,
  CircleIcon,
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
import { IDictionary } from "@/models/Dictionary";
import { formatDistanceToNow } from "date-fns";
import WTooltip from "./ui/custom/WTooltip";
import { Link } from "react-router-dom";

interface Props {
  word: IDictionary;
  className: string;
}

function WordCard({ word, className }: Props) {
  return (
    <Card className={className}>
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center text-xl leading-tight">
            {word.darija} <Expand className="ml-2 h-4 w-4 cursor-pointer" />
          </CardTitle>
          <CardDescription className="capitalize">
            <span className="font-bold text-orange-500">{word.english}</span>{" "}
            <br />
            {word.arabic}
          </CardDescription>
          <div className="absolute right-4 top-4 flex h-fit items-center justify-between gap-2 rounded-md bg-secondary px-4 text-secondary-foreground">
            <WTooltip
              side="top"
              content={
                word.favorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Link
                to="#"
                className={
                  buttonVariants({ variant: "secondary" }) + " !p-0 shadow-none"
                }
              >
                {word.favorite && (
                  <>
                    <StarIcon className="size-4 cursor-pointer fill-orange-600 stroke-orange-500" />
                  </>
                )}
                {!word.favorite && (
                  <>
                    <StarIcon className="size-4 cursor-pointer" />
                  </>
                )}
              </Link>
            </WTooltip>

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
                <DropdownMenuItem>
                  <ListCollapse className="mr-2 h-4 w-4" /> Details
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
          {word.date && (
            <div className="flex items-center capitalize">
              <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
              {formatDistanceToNow(word.date, { addSuffix: true })}
            </div>
          )}
          <div className="flex items-center gap-2">
            {word.popularity && (
              <div className="flex items-center">
                <StarIcon className="mr-1 size-4" />
                word.popularity
              </div>
            )}
            <WTooltip side="top" content="Verified by <br /> the community">
              <ShieldCheck className="size-4 text-green-600" />
            </WTooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WordCard;
