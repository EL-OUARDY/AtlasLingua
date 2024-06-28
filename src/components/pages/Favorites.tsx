import { Separator } from "../ui/separator";

function Favorites() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Favorites</h2>
        <p className="mt-1 text-muted-foreground">
          Get Easy Access to your Saved Entries.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex h-full"></div>
    </div>
  );
}

export default Favorites;
