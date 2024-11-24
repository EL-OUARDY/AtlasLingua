import { Separator } from "../ui/separator";

function LiveAssistance() {
  return (
    <>
      <div className="flex h-full flex-1 flex-col items-center justify-start shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        <div className="w-full p-4 sm:p-0">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            Live Assistance
            <span className="inline-block rounded border border-blue-600 px-2 py-1 text-xs font-normal text-blue-600">
              Coming Soon
            </span>
          </h2>
        </div>
        <Separator className="sm:my-6" />
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Get help immediately!
            </h3>
            <p className="text-sm text-muted-foreground">
              Count on us! We can provide you realtime assistance for your own
              customized needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LiveAssistance;
