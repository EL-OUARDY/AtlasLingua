/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { ICommunityPost } from "@/models/Community";
import {
  CheckCircle2Icon,
  Edit3Icon,
  EllipsisVertical,
  Flag,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";
import { Timestamp } from "firebase/firestore";
import { useShareLink } from "@/contexts/ShareLinkContext";
import { ROUTES } from "@/routes/routes";
import { useReportPost } from "@/contexts/ReportPostContext";
import { useUser } from "@/contexts/UserContext";
import UpVoteIcon from "../ui/icons/UpVoteIcon";
import WTooltip from "../ui/custom/WTooltip";
import { Highlight } from "react-instantsearch";
import type { BaseHit, Hit } from "instantsearch.js";
import { USER_ROLES } from "@/models/User";
interface Props {
  post: ICommunityPost | Hit<BaseHit>;
  selectedPost: string | null;
  onSelect: (id: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string) => void;
}

function PostCard({ post, selectedPost, onSelect, onDelete, onEdit }: Props) {
  const { user } = useUser();
  const { openShareDialog } = useShareLink();
  const { openReportDialog } = useReportPost();
  return (
    <div
      onClick={() => {
        onSelect(post.id as string);
      }}
      className={cn(
        "relative flex h-fit flex-col items-start gap-3 overflow-hidden rounded-lg border bg-background p-4 text-left text-sm transition-all dark:bg-muted/40",
        selectedPost === post.id && "post-selected group !bg-muted",
      )}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex w-full items-center gap-1">
              <div className="flex w-full items-center text-lg font-semibold tracking-tighter">
                <div className="mr-auto flex items-center gap-1 capitalize">
                  {post._highlightResult ? (
                    <Highlight
                      attribute="user.name"
                      hit={post as any}
                      classNames={{
                        highlighted: " bg-yellow-400",
                      }}
                    />
                  ) : (
                    post.user.name
                  )}
                  {post.user.role === USER_ROLES.CONTRIBUTOR && (
                    <CheckCircle2Icon className="size-4 rounded-full text-green-600" />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="size-4 cursor-pointer text-secondary-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className=""
                    forceMount
                  >
                    {user && user.id === post.user.id && (
                      <>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(post.id as string);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit3Icon className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(post.id as string);
                          }}
                          className="cursor-pointer"
                        >
                          <Trash2Icon className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareDialog(
                          `${window.location.origin + ROUTES.community}?post_id=${post.id as string}`,
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <Share2Icon className="mr-2 size-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        openReportDialog(post.id as string);
                      }}
                      className="cursor-pointer"
                    >
                      <Flag className="mr-2 size-4" /> Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="line-clamp-3 cursor-pointer text-sm text-muted-foreground">
          {post._highlightResult ? (
            <Highlight
              attribute="content"
              hit={post as any}
              classNames={{
                highlighted: "bg-yellow-400",
              }}
            />
          ) : (
            post.content.substring(0, 300)
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:mr-auto">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant={"outline"}
                  className="font-thin capitalize group-[.post-selected]:border-muted-foreground/20 group-[.post-selected]:bg-secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <Separator className="group-[.post-selected]:bg-muted-foreground/10" />
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
        <div className="flex w-full items-center justify-center sm:flex-1">
          <div
            className={cn(
              "mr-auto flex-1 text-xs",
              selectedPost === post.id
                ? "text-foreground"
                : "text-muted-foreground",
            )}
            title={(post.date as Timestamp).toDate().toLocaleString()}
          >
            {formatDistanceToNow(
              (post.date as Timestamp).toDate().toLocaleString(),
              { addSuffix: true },
            )}
          </div>
          <div
            className={cn(
              "ml-auto flex gap-4",
              selectedPost === post.id
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <WTooltip content="Upvote">
              <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                <UpVoteIcon className="mr-2 size-3 stroke-1" />
                {post.votesCount || 0}
              </div>
            </WTooltip>
            <WTooltip content="Comments">
              <div
                onClick={() => {
                  onSelect(post.id as string);
                }}
                className="flex cursor-pointer items-center justify-center hover:text-foreground"
              >
                <svg
                  className="mr-2 size-3 stroke-1"
                  fill="currentColor"
                  icon-name="comment-outline"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.725 19.872a.718.718 0 0 1-.607-.328.725.725 0 0 1-.118-.397V16H3.625A2.63 2.63 0 0 1 1 13.375v-9.75A2.629 2.629 0 0 1 3.625 1h12.75A2.63 2.63 0 0 1 19 3.625v9.75A2.63 2.63 0 0 1 16.375 16h-4.161l-4 3.681a.725.725 0 0 1-.489.191ZM3.625 2.25A1.377 1.377 0 0 0 2.25 3.625v9.75a1.377 1.377 0 0 0 1.375 1.375h4a.625.625 0 0 1 .625.625v2.575l3.3-3.035a.628.628 0 0 1 .424-.165h4.4a1.377 1.377 0 0 0 1.375-1.375v-9.75a1.377 1.377 0 0 0-1.374-1.375H3.625Z"></path>
                </svg>
                {post.commentsCount || 0}
              </div>
            </WTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
