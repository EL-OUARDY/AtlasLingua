import WordCard from "../WordCard";
import { Separator } from "../ui/separator";
import ScrollableMenu from "../ScrollableMenu";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORIES } from "@/models/Dictionary";
import dictionaryService from "@/services/dictionaryService";
import { IDictionary } from "@/models/Dictionary";
import { CanceledError } from "axios";
import { toast } from "sonner";

function Learn() {
  const [dictionaryData, setDictionaryData] = useState<IDictionary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("family");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = dictionaryService.getCategory(selectedCategory);
    request
      .then((res) => {
        setDictionaryData(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        toast("Failed to load data. Please refresh the page", {
          description: err.message,
          action: {
            label: "OK",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
    return () => cancel(); // abort http request
  }, [selectedCategory]);

  return (
    <div className="flex h-full flex-col p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
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
          links={CATEGORIES}
          selected={selectedCategory}
          className="hidden h-fit flex-row gap-4 sm:flex"
        />

        <div className="mt-4 w-full sm:hidden">
          <Select onValueChange={(link) => setSelectedCategory(link)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat, index) => (
                <SelectItem key={index} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
          {dictionaryData
            .filter(
              (x) =>
                x.english.includes(searchQuery) ||
                x.darija.includes(searchQuery),
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
