import { dummyCategories, dummyData } from "@/shared/dummy-data";
import WordCard from "../WordCard";
import { Separator } from "../ui/separator";
import ScrollableMenu from "../ScrollableMenu";
import { useState } from "react";

function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("family");
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
        <ScrollableMenu
          onChange={(link) => setSelectedCategory(link)}
          links={dummyCategories}
          selected={selectedCategory}
        />

        <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dummyData
            .filter((x) => x.category == selectedCategory)
            .map((item, index) => (
              <WordCard key={index} word={item} className="" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
