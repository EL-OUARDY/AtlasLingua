import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function FavoriteCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-1 flex-row gap-4 space-y-0 p-4">
        <div className="flex flex-1 flex-col">
          <CardTitle className="">
            <Skeleton className="h-4 w-11/12" />
          </CardTitle>
          <CardDescription className="flex flex-1 flex-col gap-2 first-word-cap">
            <span className="mt-2">
              <Skeleton className="h-4 w-10/12" />
            </span>
            <div className="">
              <Skeleton className="h-4 w-6/12" />
            </div>
            <div className="">
              <Skeleton className="h-4 w-4/12" />
            </div>
            <div className="mt-auto flex items-center gap-2">
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className="h-4 w-5/12" />
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="border-t px-4 py-2">
        <div className="flex w-full items-center gap-2">
          <Button variant="ghost" size={"icon"} className="border border-muted">
            <Skeleton className="size-4 rounded-sm" />
          </Button>
          <Button variant="ghost" size={"icon"} className="border border-muted">
            <Skeleton className="size-4 rounded-sm" />
          </Button>

          <div className="ml-auto">
            <Button
              variant="ghost"
              className="cursor-default border border-muted"
            >
              <Skeleton className="size-4 rounded-sm" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FavoriteCardSkeleton;
