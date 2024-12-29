import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import PostCardSkeleton from "./PostCardSkeleton";

function SinglePostSkeleton() {
  return (
    <div className="flex max-h-full flex-1 flex-col">
      <div className="flex w-full items-start pb-4">
        <div className="flex w-full items-start gap-4 text-sm">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />

          <div className="grid w-full gap-1">
            <div className="flex items-center font-semibold">
              <div className="mr-auto flex w-full items-center gap-1">
                <Skeleton className="h-4 w-5/12" />
              </div>
              <Skeleton className="h-6 w-2" />
            </div>
            <Skeleton className="h-4 w-9/12" />
          </div>
        </div>
      </div>
      <Separator />
      <ScrollArea className="overflow-auto whitespace-pre-wrap pt-4 text-sm">
        <div className="flex flex-col gap-4">
          <PostCardSkeleton header={false} textLines={3} />
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <PostCardSkeleton
                key={index}
                header={false}
                textLines={2}
                showTags={false}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SinglePostSkeleton;
