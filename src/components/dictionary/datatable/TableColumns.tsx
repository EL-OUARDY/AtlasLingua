import { IDictionary } from "@/models/Dictionary";
import { ColumnDef } from "@tanstack/react-table";
import { HelpCircle, ShieldCheck, Star } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./DataTableRowActions";
import WTooltip from "@/components/ui/custom/WTooltip";

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
      <DataTableColumnHeader column={column} title="Arabic">
        <WTooltip side="right" content="Darija written <br> in Arabic letters">
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
      const id = row.getValue("id");
      if (favorite)
        return (
          <Star
            onClick={() => console.log({ id: id, favourite: favorite })}
            className="size-5 cursor-pointer fill-orange-600 stroke-orange-500"
          />
        );

      return (
        <Star
          onClick={() => console.log({ id: id, favourite: favorite })}
          className="size-5 cursor-pointer stroke-muted-foreground"
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
