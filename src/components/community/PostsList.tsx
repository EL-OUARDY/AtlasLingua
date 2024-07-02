import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { ICommunityPost } from "@/models/CommunityPost";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  CheckCircle2Icon,
  Edit3Icon,
  EllipsisVertical,
  Flag,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  posts: ICommunityPost[];
  onSelect: (id: number) => void;
}
function PostsList({ posts, onSelect }: Props) {
  const [selectedPost, setSelectedPost] = useState<number>(-1);

  return (
    <>
      {posts.map((post, index) => (
        <div
          key={index}
          className={cn(
            "relative flex h-fit flex-col items-start gap-3 overflow-hidden rounded-lg border bg-background p-4 text-left text-sm transition-all dark:bg-muted/40",
            selectedPost === post.id && "post-selected group !bg-muted",
          )}
          onClick={() => {
            setSelectedPost(post.id);
            onSelect(post.id);
          }}
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex w-full items-center gap-1">
                <div className="flex w-full items-center text-lg font-semibold tracking-tighter">
                  <div className="mr-auto flex items-center gap-2">
                    {post.user.name}
                    {post.user.role === "contributor" && (
                      <CheckCircle2Icon className="size-4 rounded-full text-green-600" />
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="h-4 w-4 cursor-pointer text-secondary-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      alignOffset={-5}
                      className=""
                      forceMount
                    >
                      <DropdownMenuItem>
                        <Edit3Icon className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share2Icon className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" /> Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium">{post.user.role}</div>
          </div>
          <div className="line-clamp-2 text-sm text-muted-foreground">
            {post.content.substring(0, 300)}
          </div>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            {post.tags.length ? (
              <div className="flex flex-wrap items-center gap-2 self-start sm:mr-auto">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={"outline"}
                    className="font-thin group-[.post-selected]:border-muted-foreground/20 group-[.post-selected]:bg-secondary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          <Separator className="group-[.post-selected]:bg-muted-foreground/10" />
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            <div className="flex w-full items-center justify-center gap-4 sm:flex-1">
              <div
                className={cn(
                  "mr-auto flex-1 text-xs",
                  selectedPost === post.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {formatDistanceToNow(post.date, { addSuffix: true })}
              </div>
              <div
                className={cn(
                  "ml-auto flex gap-4",
                  selectedPost === post.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
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
                        <svg
                          className="mr-2 size-3 stroke-1"
                          fill="currentColor"
                          icon-name="comment-outline"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.725 19.872a.718.718 0 0 1-.607-.328.725.725 0 0 1-.118-.397V16H3.625A2.63 2.63 0 0 1 1 13.375v-9.75A2.629 2.629 0 0 1 3.625 1h12.75A2.63 2.63 0 0 1 19 3.625v9.75A2.63 2.63 0 0 1 16.375 16h-4.161l-4 3.681a.725.725 0 0 1-.489.191ZM3.625 2.25A1.377 1.377 0 0 0 2.25 3.625v9.75a1.377 1.377 0 0 0 1.375 1.375h4a.625.625 0 0 1 .625.625v2.575l3.3-3.035a.628.628 0 0 1 .424-.165h4.4a1.377 1.377 0 0 0 1.375-1.375v-9.75a1.377 1.377 0 0 0-1.374-1.375H3.625Z"></path>
                        </svg>
                        {post.commentsNumber || 0}
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
        </div>
      ))}
    </>
  );
}

export default PostsList;
