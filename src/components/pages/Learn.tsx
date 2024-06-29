import { dummyData, dummyCategories } from "@/shared/dummy-data";
import WordCard from "../WordCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Learn() {
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
          <div className="flex cursor-pointer items-center justify-center rounded-md bg-green-500 px-2">
            <ChevronLeft />
          </div>
          <ScrollArea className="grid grid-cols-1 gap-4">
            <div className="flex gap-4">
              {dummyCategories.map((cat, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border px-3 py-2 capitalize"
                >
                  {cat}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="flex cursor-pointer items-center justify-center rounded-md bg-green-500 px-2">
            <ChevronRight />
          </div>
        </div>
        <Separator className="my-2" />

        <div className="grid h-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dummyData.slice(0, 20).map((item, index) => (
            <WordCard key={index} word={item} className="" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
