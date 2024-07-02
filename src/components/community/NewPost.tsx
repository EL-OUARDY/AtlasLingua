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
    <div className="relative flex h-full w-full min-w-[180px] flex-col">
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
        {/* <ScrollArea className="overflow-auto whitespace-pre-wrap pt-4 text-sm">
          <div className="flex h-full flex-col gap-4">
            <div className="w-full rounded-lg border-0 border-l-2 border-primary/50 bg-background p-2 text-muted-foreground dark:bg-muted/40">
              {"user@atlaslingua.com"}
              <Separator className="my-4" />
              <div className="flex items-center">
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.date, { addSuffix: true })}
                </div>
                <div className="ml-auto flex gap-4 text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                          <svg
                            className="mr-2 size-3 stroke-1"
                            fill="currentColor"
                            icon-name="upvote-outline"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>{" "}
                          </svg>
                          {post.votes}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                        side="top"
                      >
                        <p>Vote</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                          <ReplyAllIcon
                            onClick={() => {
                              setShowNewComment(true);
                            }}
                            className="mr-2 size-5 stroke-1"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                        side="top"
                      >
                        <p>Reply</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            {dummyPostComments.map((comment, index) => (
              <div
                key={index}
                className="w-full rounded-lg border bg-background p-2 text-muted-foreground dark:bg-muted/40"
              >
                <span className="tracking-tight text-primary">{`${comment.user.name}: `}</span>
                {comment.content}
                <Separator className="my-4" />
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.date, { addSuffix: true })}
                  </div>
                  <div className="ml-auto flex gap-4 text-xs text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                            <svg
                              className="mr-2 size-3 stroke-1"
                              fill="currentColor"
                              icon-name="upvote-outline"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>{" "}
                            </svg>
                            {comment.votes}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                          side="top"
                        >
                          <p>Vote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                            <ReplyAllIcon
                              onClick={() => {
                                setShowNewComment(true);
                              }}
                              className="mr-2 size-5 stroke-1"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                          side="top"
                        >
                          <p>Reply</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea> */}

        <form className="h-full pt-4">
          <div className="flex h-full flex-col gap-4">
            <Textarea
              className="no-ring h-full p-4 text-sm"
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
