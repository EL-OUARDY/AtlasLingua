import { IDictionary } from "@/models/Dictionary";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, Star } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./DataTableRowActions";

export const columns: ColumnDef<IDictionary>[] = [
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
      <DataTableColumnHeader column={column} title="Arabic" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-light capitalize">
        {row.getValue("type")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "verified",
    invertSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("verified");
      if (verified)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldCheck className="size-5 text-green-600" />
              </TooltipTrigger>
              <TooltipContent
                className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                side="top"
              >
                <p>
                  Verified by <br /> the community
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "favorite",
    invertSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Favorite" />
    ),
    cell: ({ row }) => {
      const favorite = row.getValue("favorite");
      const id = row.getValue("id");
      if (favorite)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="">
                <Star
                  onClick={() => console.log({ id: id, favourite: favorite })}
                  className="size-5 cursor-pointer fill-orange-600 stroke-orange-500"
                />
              </TooltipTrigger>
              <TooltipContent className="text-center">
                Remove from <br /> your list
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="">
              <Star
                onClick={() => console.log({ id: id, favourite: favorite })}
                className="size-5 cursor-pointer stroke-muted-foreground"
              />
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
