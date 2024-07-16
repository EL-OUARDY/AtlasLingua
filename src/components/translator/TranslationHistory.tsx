import { Button } from "@/components/ui/button";
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
  ListCollapse,
  Copy,
  Calendar,
  ShieldCheck,
  EllipsisVertical,
  Trash2,
  Star,
} from "lucide-react";
import WTooltip from "../ui/custom/WTooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

interface ITranslationHistory {
  source: string;
  destination: string;
  verified: boolean;
  date: string;
}

function TranslationHistory() {
  const { isHistoryOpen, setIsHistoryOpen } = useHistory();
  const historyList: ITranslationHistory[] = [
    {
      source: "Good morning",
      destination: "Sbah l'kheir",
      verified: true,
      date: "2024-07-10T08:15:30Z",
    },
    {
      source: "Shukran",
      destination: "Thank you",
      verified: true,
      date: "2024-07-10T09:30:45Z",
    },
    {
      source: "How are you?",
      destination: "Labas?",
      verified: true,
      date: "2024-07-10T11:20:15Z",
    },
    {
      source: "Bghit kas dyal atay",
      destination: "I want a cup of tea",
      verified: false,
      date: "2024-07-10T13:45:00Z",
    },
    {
      source: "Where is the market?",
      destination: "Fin kayn s'souk?",
      verified: true,
      date: "2024-07-10T15:10:20Z",
    },
    {
      source: "Nta mn fin?",
      destination: "Where are you from?",
      verified: true,
      date: "2024-07-10T16:30:40Z",
    },
    {
      source: "Delicious food",
      destination: "Makla bnina",
      verified: false,
      date: "2024-07-10T18:05:10Z",
    },
    {
      source: "Bard l7al",
      destination: "It's cold",
      verified: true,
      date: "2024-07-10T19:20:30Z",
    },
    {
      source: "See you tomorrow",
      destination: "Nchoufk ghedda",
      verified: true,
      date: "2024-07-10T20:45:55Z",
    },
    {
      source: "Safi",
      destination: "Okay",
      verified: true,
      date: "2024-07-10T22:00:15Z",
    },
  ];

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
          <div className="grid h-full grid-cols-1 items-center gap-4 py-4">
            {historyList.map((item, index) => (
              <Card key={index} className="">
                <CardHeader className="relative flex flex-row gap-4 space-y-0 p-2 sm:p-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg leading-tight sm:text-xl">
                      <span className="mr-auto line-clamp-1">
                        {item.source}
                      </span>
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
                            <DropdownMenuItem>
                              <ListCollapse className="mr-2 h-4 w-4" /> Show
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" /> Save
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${item.source} = ${item.destination}`,
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
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardTitle>
                    <CardDescription className="">
                      <span className="font-bold text-orange-500">
                        {item.destination}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <div className="flex justify-between space-x-4 text-sm text-muted-foreground">
                    {item.date && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 stroke-sky-400" />
                        {formatDistanceToNow(item.date, { addSuffix: true })}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {item.verified && (
                        <WTooltip
                          side="top"
                          content="Verified by <br /> the community"
                        >
                          <ShieldCheck className="size-4 text-green-600" />
                        </WTooltip>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Clear history</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TranslationHistory;
