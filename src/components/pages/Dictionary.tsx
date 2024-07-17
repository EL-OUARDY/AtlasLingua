import { columns } from "../dictionary/datatable/TableColumns";
import { DataTable } from "../DataTable";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import dictionaryService, {
  IDictFetchDataOptions,
  IDictFetchDataResult,
} from "@/services/dictionaryService";
import { toast } from "sonner";
import { CanceledError } from "axios";

function Dictionary() {
  const [dictionaryData, setDictionaryData] = useState<IDictFetchDataResult>(
    {} as IDictFetchDataResult,
  );
  const [dataOptions, setDataOptions] = useState<IDictFetchDataOptions>({
    pageIndex: 0,
    pageSize: 5,
    search: "",
    sortBy: "id",
    sortOrder: "asc",
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = dictionaryService.get_all(dataOptions);
    request
      .then((res) => {
        setDictionaryData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        toast("Failed to load data. Please refresh the page", {
          action: {
            label: "OK",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => {});
    return () => cancel(); // abort http request
  }, [dataOptions]);

  return (
    <div className="flex h-full flex-col p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Dictionary</h2>
        <p className="mt-1 text-muted-foreground">
          Browse Our Extensive Repository of English to Darija Translations.
        </p>
      </div>
      <Separator className="my-6" />
      <DataTable
        data={dictionaryData.data || {}}
        columns={columns}
        fetchData={setDataOptions}
        pageCount={dictionaryData.pageCount}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Dictionary;
