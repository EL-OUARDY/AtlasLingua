import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <>
      <h1 className="hidden text-xl font-bold tracking-tight sm:block md:text-2xl"></h1>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            <strong>404</strong> — Feeling Lost?
          </h3>
          <p className="mb-2 text-sm text-muted-foreground">
            Don't worry you can always back to home page
          </p>
          <Button variant={"default"}>Go HomePage</Button>
        </div>
      </div>
    </>
  );
}

export default NotFound;
