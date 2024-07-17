import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { X } from "lucide-react";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableGetFacetedFilter";
import { VOCABULARY_TYPES } from "@/models/Dictionary";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch: (query: string) => void;
  filterChange: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  filterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Search .."
        autoComplete="off"
        id="search"
        onChange={(event) => {
          onSearch(event.target.value);
          filterChange();
        }}
        className="no-ring h-10 w-full md:w-[150px] lg:w-[250px]"
      />
      <div className="flex w-full flex-1 gap-1">
        {table.getColumn("word_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("word_type")}
            title="Type"
            options={VOCABULARY_TYPES}
            onChange={filterChange}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <div className="ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
