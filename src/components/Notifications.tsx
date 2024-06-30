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
import { useNotification } from "@/contexts/NotificationContext";

function Notifications() {
  const { isNotificationOpen, toggleNotification } = useNotification();

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
      <DialogContent className="w-11/12 rounded-lg p-0 sm:w-[450px]">
        <DialogHeader>
          <DialogTitle>
            <span className="sr-only">Notifications</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Card className="w-full border-0">
          <CardHeader className="pt-0">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[400px]">
            <CardContent className="flex flex-col gap-2 p-2 sm:p-6">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg p-3 hover:bg-secondary"
                >
                  <n.icon className="size-5 sm:size-6" />
                  <div className="grid gap-2">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                      {n.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <p>{n.type}</p>
                      <Badge
                        variant="outline"
                        className="overflow-hidden text-ellipsis whitespace-nowrap"
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
