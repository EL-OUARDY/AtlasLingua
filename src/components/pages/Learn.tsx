import { dummyCategories, dummyDictionaryData } from "@/shared/dummy-data";
import WordCard from "../WordCard";
import { Separator } from "../ui/separator";
import ScrollableMenu from "../ScrollableMenu";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import Combobox from "../ComboBox";

function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("family");
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Learn</h2>
          <p className="mt-1 text-muted-foreground">
            Darija Learning Center: Tools and Resources.
          </p>
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
      <Separator className="my-6 hidden sm:block" />
      <div className="flex flex-col gap-4">
        <ScrollableMenu
          onChange={(link) => setSelectedCategory(link)}
          links={dummyCategories}
          selected={selectedCategory}
          className="hidden h-fit flex-row gap-4 sm:flex"
        />

        <div className="mt-4 w-full sm:hidden">
          <Combobox
            text="category"
            onChange={(link) => setSelectedCategory(link)}
            items={dummyCategories.map((x) => ({ value: x, label: x }))}
          />
        </div>

        <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyDictionaryData
            .filter(
              (x) =>
                x.category == selectedCategory &&
                x.english.includes(searchQuery),
            )
            .map((item, index) => (
              <WordCard key={index} word={item} className="" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
