import { IDictionary } from "@/models/Dictionary";
import WordCard from "../WordCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Learn() {
  const data: IDictionary[] = [
    {
      id: 1,
      english: "hi",
      darija: "salam",
      type: "noun",
      arabic: "سلام",
      favorite: false,
      verified: true,
    },
    {
      id: 2,
      english: "play",
      darija: "l3b",
      type: "verb",
      arabic: "لعب",
      favorite: true,
      verified: true,
    },
    {
      id: 3,
      english: "crazy",
      darija: "msti",
      type: "adjective",
      arabic: "مسطي",
      favorite: false,
      verified: true,
    },
    {
      id: 4,
      english: "always",
      darija: "dima",
      type: "adverb",
      arabic: "ديما",
      favorite: false,
      verified: false,
    },
    {
      id: 5,
      english: "below",
      darija: "t7t",
      type: "preposition",
      arabic: "تحت",
      favorite: false,
      verified: true,
    },
    {
      id: 6,
      english: "cold",
      darija: "bard",
      type: "adjective",
      arabic: "بارد",
      favorite: false,
      verified: true,
    },
    {
      id: 7,
      english: "slowly",
      darija: "bchwiya",
      type: "adverb",
      arabic: "بشوية",
      favorite: false,
      verified: true,
    },
    {
      id: 8,
      english: "look",
      darija: "chof",
      type: "verb",
      arabic: "شوف",
      favorite: false,
      verified: true,
    },
    {
      id: 9,
      english: "forest",
      darija: "ghaba",
      type: "noun",
      arabic: "غابة",
      favorite: false,
      verified: false,
    },
    {
      id: 10,
      english: "window",
      darija: "shrjem",
      type: "noun",
      arabic: "شرجم",
      favorite: false,
      verified: true,
    },
  ];
  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Learn</h2>
        <p className="mt-1 text-muted-foreground">
          Darija Learning Center: Tools and Resources.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <div className="flex h-fit flex-row gap-4 rounded-lg">
          <div className="flex min-h-10 w-fit cursor-pointer items-center justify-center rounded-md bg-green-500 px-4">
            <ChevronLeft />
          </div>
          <ScrollArea className="grid grid-cols-1 gap-4">
            <div className="flex gap-4">
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
              <div className="min-h-10 w-32 rounded-md bg-indigo-500"></div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="flex min-h-10 w-fit cursor-pointer items-center justify-center rounded-md bg-green-500 px-4">
            <ChevronRight />
          </div>
        </div>
        <Separator className="my-2" />

        <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <WordCard key={index} word={item} className="" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
