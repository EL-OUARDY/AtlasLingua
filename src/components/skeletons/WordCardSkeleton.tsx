import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function WordCardSkeleton() {
  return (
    <Card>
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center">
            <Skeleton className="h-4 w-[120px]" />
          </CardTitle>
          <CardDescription>
            <span>
              <Skeleton className="h-4 w-[90px]" />
            </span>
            <br />
            <Skeleton className="h-4 w-full" />
          </CardDescription>
          <div className="min-size-10 absolute right-4 top-4 !m-0 flex h-fit items-center justify-between gap-2 rounded-md">
            <Skeleton className="h-10 w-[3rem]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between space-x-4">
          <div className="flex items-center">
            <Skeleton className="mr-1 size-3" />
            <Skeleton className="h-4 w-[110px]" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="mr-1 size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WordCardSkeleton;
