import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function HistorySkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="relative flex flex-row gap-4 space-y-0 p-4 sm:p-6">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex w-full items-center">
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-4 w-[220px]" />
              <Skeleton className="size-4" />
            </div>
          </CardTitle>
          <CardDescription className="capitalize">
            <span className="font-bold">
              <Skeleton className="h-4 w-[180px]" />
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between space-x-4">
          <div className="flex items-center capitalize">
            <Skeleton className="mr-1 size-4" />
            <Skeleton className="h-4 w-[110px]" />
          </div>
          <Skeleton className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default HistorySkeleton;