import { columns } from "../dictionary/datatable/TableColumns";
import { DataTable } from "../DataTable";
import { Separator } from "../ui/separator";
import { dummyData } from "@/shared/dummy-data";

function Dictionary() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Dictionary</h2>
        <p className="mt-1 text-muted-foreground">
          Browse Our Extensive Repository of English to Darija Translations.
        </p>
      </div>
      <Separator className="my-6" />
      <DataTable data={dummyData} columns={columns} />
    </div>
  );
}

export default Dictionary;
