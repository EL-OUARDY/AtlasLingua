import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function PostCardSkeleton({ header = true, textLines = 2, showTags = true }) {
  return (
    <div className="relative flex h-fit flex-col items-start gap-3 overflow-hidden rounded-lg border bg-background p-4 transition-all dark:bg-muted/40">
      {header && (
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex w-full items-center gap-1">
              <div className="flex w-full items-center font-semibold tracking-tighter">
                <div className="mr-auto flex w-full items-center gap-2">
                  <Skeleton className="h-6 w-6/12" />
                </div>
                <Skeleton className="h-6 w-2" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-2">
        {Array(textLines)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-3 w-full" />
          ))}
      </div>
      {showTags && (
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <div className="flex w-full flex-wrap items-center gap-2 self-start sm:mr-auto">
            <Skeleton className="h-4 w-4/12" />
            <Skeleton className="h-4 w-5/12" />
          </div>
        </div>
      )}
      <Separator className="group-[.post-selected]:bg-muted-foreground/10" />
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
        <div className="flex w-full items-center justify-center gap-4 sm:flex-1">
          <div className="mr-auto flex-1">
            <Skeleton className="h-4 w-8/12" />
          </div>
          <div className="ml-auto flex gap-4">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCardSkeleton;
