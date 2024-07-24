import { DataTable } from "../DataTable";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import dictionaryService, {
  IDictFetchDataOptions,
  IDictFetchDataResult,
} from "@/services/dictionaryService";
import { toast } from "sonner";
import { CanceledError } from "axios";
import { IDictionary } from "@/models/Dictionary";
import { ColumnDef } from "@tanstack/react-table";
import { HelpCircle, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WTooltip from "@/components/ui/custom/WTooltip";
import { DataTableColumnHeader } from "../dictionary/datatable/DataTableColumnHeader";
import { DataTableRowActions } from "../dictionary/datatable/DataTableRowActions";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { useNavigate } from "react-router-dom";
import favoriteService from "@/services/favoriteService";

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

  const navigate = useNavigate();

  const columns: ColumnDef<IDictionary>[] = [
    {
      accessorKey: "id",
      header: "Id",
      enableHiding: false,
      enableSorting: false,
      meta: {
        hidden: false,
      },
    },
    {
      accessorKey: "english",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="English" />
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("english")}</span>
      ),
    },
    {
      accessorKey: "darija",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Darija" />
      ),
    },
    {
      accessorKey: "arabic",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Arabic">
          <WTooltip
            side="right"
            content="Darija written <br> in Arabic letters"
          >
            <div className="flex items-center gap-2">
              Arabic <HelpCircle className="size-4" />
            </div>
          </WTooltip>
        </DataTableColumnHeader>
      ),
    },
    {
      accessorKey: "word_type",
      invertSorting: true,
      enableSorting: false,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) =>
        row.getValue("word_type") && (
          <Badge variant="outline" className="font-light capitalize">
            {row.getValue("word_type")}
          </Badge>
        ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "verified",
      invertSorting: true,
      enableSorting: false,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Verified" />
      ),
      cell: ({ row }) => {
        const verified = row.getValue("verified");
        if (verified)
          return (
            <WTooltip side="top" content="Verified by <br /> the community">
              <ShieldCheck className="size-5 text-green-600" />
            </WTooltip>
          );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "favorite",
      invertSorting: true,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Favorite" />
      ),
      cell: ({ row }) => {
        const favorite = row.getValue("favorite");
        const id: number = row.getValue("id");
        if (favorite)
          return (
            <WTooltip side="top" content="Remove from list">
              <Star
                onClick={() => removeFavorite(id)}
                className="size-5 cursor-pointer fill-orange-600 stroke-orange-500"
              />
            </WTooltip>
          );

        return (
          <WTooltip side="top" content="Save">
            <Star
              onClick={() => addFavorite(id)}
              className="size-5 cursor-pointer stroke-muted-foreground"
            />
          </WTooltip>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  function addFavorite(favorite_id: number) {
    const oldData = dictionaryData;
    const newData = dictionaryData.data.map((item) =>
      item.id === favorite_id ? { ...item, favorite: true } : item,
    );
    setDictionaryData({ ...dictionaryData, data: newData });

    const { request } = favoriteService.addFavoriteFromDictionary(favorite_id);

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // user not logged in
      if (err.response && err.response.status === 401) {
        loginFirst();
        return;
      }

      // if unable to add then restore the list
      setDictionaryData(oldData);

      toast("Failed process your request.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function removeFavorite(favorite_id: number) {
    const oldData = dictionaryData;
    const newData = dictionaryData.data.map((item) =>
      item.id === favorite_id ? { ...item, favorite: false } : item,
    );
    setDictionaryData({ ...dictionaryData, data: newData });

    const { request } = favoriteService.removeDictionaryFavorite(favorite_id);

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // user not logged in
      if (err.response && err.response.status === 401) {
        loginFirst();
        return;
      }

      // if unable to add then restore the list
      setDictionaryData(oldData);

      toast("Failed process your request.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(APP_NAME + "-return-url", ROUTES.dictionary);
    // navigate to login
    navigate(ROUTES.login);
  }

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
