import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { LayoutGrid, MessageSquareMore, ThumbsUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useData } from "@/contexts/DataContext";

function Notifications() {
  const { isNotificationOpen, toggleNotification } = useData();

  const notifications = [
    {
      content: "Your post got a new comment",
      date: "2 minutes ago",
      type: "Community",
      icon: MessageSquareMore,
    },
    {
      content: "We have added new vocabulary",
      date: "17 hours ago",
      type: "Community",
      icon: LayoutGrid,
    },
    {
      content: "Someone liked your post",
      date: "Yesterday",
      type: "Community",
      icon: ThumbsUp,
    },
    {
      content: "Someone has replied on your post",
      date: "5 days ago",
      type: "Community",
      icon: MessageSquareMore,
    },
  ];

  return (
    <Dialog open={isNotificationOpen} onOpenChange={() => toggleNotification()}>
      <DialogContent className="p-0 sm:w-[400px]">
        <DialogHeader>
          <DialogTitle>
            <span className="sr-only">Notifications</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Card className="border-0 w-full">
          <CardHeader className="">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[400px]">
            <CardContent className="flex flex-col gap-2 py-2">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className=" flex items-center rounded-lg gap-4 p-3 hover:bg-secondary"
                >
                  <n.icon className="" />
                  <div className="grid gap-2 ">
                    <p className="text-md font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {n.content}
                    </p>
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <p>{n.type}</p>
                      <Badge
                        variant="outline"
                        className="whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {n.date}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default Notifications;
