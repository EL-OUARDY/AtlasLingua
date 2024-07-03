import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { CheckCircle2Icon, MoreVertical, Settings2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

function NewPost() {
  return (
    <div className="relative flex h-full w-full min-w-[180px] flex-col rounded-lg border p-4">
      <div className="flex max-h-full flex-1 flex-col">
        <div className="flex w-full items-start pb-4">
          <div className="flex w-full items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={"Atlas Lingua"} />
              <AvatarFallback className="bg-background dark:bg-secondary">
                {"Atlas Lingua"
                  .split(" ")
                  .slice(0, 2)
                  .map((chunk) => chunk[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid w-full gap-1">
              <div className="flex items-center font-semibold">
                <div className="mr-auto flex items-center gap-1">
                  {"Atlas Lingua"}
                  {"contributor" === "contributor" && (
                    <CheckCircle2Icon className="size-4 rounded-full text-green-600" />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings2 className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="line-clamp-1 text-xs">
                {"Linguistics student"}
              </div>
              {"user@atlaslingua.com" && (
                <div className="text-xs text-muted-foreground">
                  {"user@atlaslingua.com"}
                </div>
              )}
            </div>
          </div>
        </div>
        <Separator />

        <form className="h-full pt-4">
          <div className="flex h-full flex-col gap-4">
            <Textarea
              className="no-ring h-full max-h-72 p-4 text-sm"
              placeholder={`What's in your mind?`}
            />
            <div className="flex w-full max-w-sm flex-col gap-4">
              <Label htmlFor="tags" className="text-xs">
                Tags{" "}
                <small className="text-muted-foreground">
                  (Separated by comma)
                </small>
              </Label>
              <Input id="tags" className="no-ring" />
            </div>
            <Label
              htmlFor="anonymous"
              className="flex items-center gap-2 text-xs font-normal"
            >
              <Switch id="anonymous" aria-label="Comment anonymously" /> Share
              anonymously
            </Label>
            <div className="mt-auto flex flex-col">
              <Separator className="my-4" />
              <div className="flex items-center">
                <Button variant="outline">Clear</Button>
                <Button
                  onClick={(e) => e.preventDefault()}
                  size="sm"
                  className="ml-auto"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPost;
