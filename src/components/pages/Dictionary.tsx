import { IDictionary } from "@/models/Dictionary";
import { columns } from "./dictionary/TableColumns";
import { DataTable } from "../DataTable";
import { Separator } from "../ui/separator";

function Dictionary() {
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
    <>
      <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight">Dictionary</h2>
          <p className="mt-1 text-muted-foreground">
            Browse Our Extensive Repository of English to Darija Translations.
          </p>
        </div>
        <Separator className="my-6" />
        <DataTable data={data} columns={columns} />
      </div>
    </>
  );
}

export default Dictionary;
