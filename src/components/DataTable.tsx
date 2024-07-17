import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./dictionary/datatable/DataTablePagination";
import { DataTableToolbar } from "./dictionary/datatable/DataTableToolbar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect } from "react";
import { IDictFetchDataOptions } from "@/services/dictionaryService";
import { Skeleton } from "./ui/skeleton";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  fetchData: (options: IDictFetchDataOptions) => void;
  pageCount: number;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  fetchData,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [search, setSearch] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    // enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const paginationState: PaginationState = table.getState().pagination;
  useEffect(() => {
    const { pageIndex, pageSize } = paginationState;
    const options: IDictFetchDataOptions = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      search: search,
    };
    if (sorting && sorting[0]) {
      options.sortBy = sorting[0].id;
      options.sortOrder = sorting[0].desc ? "desc" : "asc";
    }
    if (columnFilters.length > 0) {
      options.wordTypes = columnFilters[0]?.value as string[];
    }

    fetchData(options);
  }, [fetchData, sorting, table, columnFilters, paginationState, search]);

  return (
    <div className="grid flex-1 grid-rows-[auto,1fr] gap-4">
      <DataTableToolbar
        table={table}
        onSearch={(query) => {
          setSearch(query);
        }}
        filterChange={() => table.setPageIndex(0)}
      />
      <ScrollArea className="rounded-md border bg-background dark:bg-transparent">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array(
                table.getRowModel().rows?.length == 0
                  ? 5
                  : paginationState.pageSize,
              )
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={columns.length} className="py-6">
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {table.getRowModel().rows?.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
