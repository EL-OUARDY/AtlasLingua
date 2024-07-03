import { dummyDictionaryData } from "@/shared/dummy-data";
import WordCard from "../WordCard";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Search } from "lucide-react";
import { useState } from "react";

function Favorites() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Favorites</h2>
          {/* <p className="mt-1 text-muted-foreground">
            Get Easy Access to your Saved Entries.
          </p> */}
        </div>
        <div className="relative flex-1 md:ml-auto md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyDictionaryData
          .filter(
            (x) =>
              x.english.toLowerCase().includes(searchQuery.toLowerCase()) &&
              x.favorite,
          )
          .map((item, index) => {
            const x = { ...item };
            x.category = null;
            x.date = "June 27, 2024";
            return <WordCard key={index} word={x} className="" />;
          })}
      </div>
    </div>
  );
}

export default Favorites;
