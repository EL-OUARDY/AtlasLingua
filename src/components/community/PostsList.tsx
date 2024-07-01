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
  EllipsisVertical,
  Flag,
  MessageCircle,
  Share2Icon,
  ThumbsUp,
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
      {posts.map((post) => (
        <div
          key={post.id}
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
                    {post.user.role === "Contributor" && (
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
          <Separator className="group-[.post-selected]:bg-muted-foreground/20" />
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
              <div className="ml-auto flex gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <ThumbsUp className="mr-2 size-4" /> {post.votes}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="rounded-xl border border-secondary bg-background px-4 py-3 text-center"
                      side="top"
                    >
                      <p>Like</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center">
                        <MessageCircle className="mr-2 size-4" />{" "}
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
