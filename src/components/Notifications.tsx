import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import {
  AtSignIcon,
  LayoutGrid,
  MessageSquareMore,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  INotificationType,
  useNotification,
} from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { APP_NAME } from "@/shared/constants";
import { createElement } from "react";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const { notifications, isNotificationOpen, toggleNotification } =
    useNotification();

  const navigate = useNavigate();

  function getNotificationTypeLabel(type: INotificationType) {
    if (["new_comment", "new_mention"].includes(type)) return "Community";

    if (type === "alert") return "Alert";
    if (type === "communication") return "Communication";
    if (type === "new_feature") return "New Feature";

    return APP_NAME; // Default fallback
  }

  function getNotificationIcon(type: INotificationType) {
    if (type === "new_comment") return MessageSquareMore;
    if (type === "new_mention") return AtSignIcon;
    if (type === "alert") return TriangleAlertIcon;
    if (type === "communication") return UsersIcon;
    if (type === "new_feature") return LayoutGrid;

    return LayoutGrid; // Default fallback
  }

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
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <Separator />
          <ScrollArea className="h-[400px]">
            <CardContent className="flex h-full flex-col gap-2 p-2 sm:p-4">
              {notifications.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <img
                    src="img/no-notif.svg"
                    className="h-20"
                    alt="No Notifications"
                  />
                  <div className="text-center">
                    <div className="text-lg font-bold">No Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Silence is gold!
                    </div>
                  </div>
                </div>
              )}
              {notifications &&
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-4 rounded-lg border p-3 hover:bg-secondary"
                    onClick={() => {
                      navigate(notification.link);
                      toggleNotification();
                    }}
                  >
                    {createElement(getNotificationIcon(notification.type), {
                      className: "size-5 sm:size-6",
                    })}
                    <div className="grid flex-1 gap-2">
                      <p className="overflow-hidden text-ellipsis text-sm font-medium">
                        {notification.body}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <p>{getNotificationTypeLabel(notification.type)}</p>
                        <Badge
                          variant="outline"
                          className="overflow-hidden text-ellipsis whitespace-nowrap font-normal"
                          title={notification.date.toDate().toLocaleString()}
                        >
                          {formatDistanceToNow(
                            notification.date.toDate().toLocaleString(),
                            { addSuffix: true },
                          )}
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
