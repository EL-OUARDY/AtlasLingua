import {
  ChevronDownIcon,
  CircleIcon,
  Copy,
  Expand,
  Flag,
  ListCollapse,
  ShieldCheck,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { IDictionary } from "@/models/Dictionary";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  word: IDictionary;
  className: string;
}

function WordCard({ word, className }: Props) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center text-xl leading-tight">
            {word.darija} <Expand className="ml-2 h-4 w-4 cursor-pointer" />
          </CardTitle>
          <CardDescription className="capitalize">
            {word.english} <br />
            {word.arabic}
          </CardDescription>
        </div>
        <div className="flex h-fit items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3 shadow-none">
            {word.favorite && (
              <>
                <StarIcon className="mr-2 h-4 w-4 cursor-pointer fill-orange-600 stroke-orange-500" />
                <span className="hidden md:inline">Saved</span>
              </>
            )}
            {!word.favorite && (
              <>
                <StarIcon className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Save</span>
              </>
            )}
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
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
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center capitalize">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {word.category}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <StarIcon className="mr-1 size-4" />
              20k
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShieldCheck className="size-4 text-green-600" />
                </TooltipTrigger>
                <TooltipContent
                  className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                  side="top"
                >
                  <p>
                    Verified by <br /> the community
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WordCard;