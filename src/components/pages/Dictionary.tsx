import { columns } from "../dictionary/datatable/TableColumns";
import { DataTable } from "../DataTable";
import { Separator } from "../ui/separator";
import { dummyDictionaryData } from "@/shared/dummy-data";

function Dictionary() {
  return (
    <div className="flex h-full flex-col p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Dictionary</h2>
        <p className="mt-1 text-muted-foreground">
          Browse Our Extensive Repository of English to Darija Translations.
        </p>
      </div>
      <Separator className="my-6" />
      <DataTable data={dummyDictionaryData} columns={columns} />
    </div>
  );
}

export default Dictionary;
