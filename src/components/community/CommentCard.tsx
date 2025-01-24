import { ICommunityComment, ICommunityPost } from "@/models/Community";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import {
  ReplyAllIcon,
  EllipsisVertical,
  Edit3Icon,
  Trash2Icon,
  Flag,
  CheckCircle2Icon,
} from "lucide-react";
import WTooltip from "../ui/custom/WTooltip";
import UpVoteIcon from "../ui/icons/UpVoteIcon";
import { Separator } from "../ui/separator";
import { useReportPost } from "@/contexts/ReportPostContext";
import { useUser } from "@/contexts/UserContext";
import { USER_ROLES } from "@/models/User";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { useCommunity } from "@/contexts/CommunityContext";
import { useEffect } from "react";

interface Props {
  post: ICommunityPost;
  comment: ICommunityComment;
  onReply: () => void;
  onEdit: () => void;
  onDelete: (commentId: string) => void;
}
function CommentCard({ post, comment, onReply, onEdit, onDelete }: Props) {
  const { user, isAuthenticated } = useUser();
  const { openReportDialog } = useReportPost();
  const { voteComment, hasUserVotedOnComment } = useCommunity();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    hasUserVotedOnComment(comment.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, post.id, user]);

  async function vote(comment: ICommunityComment) {
    if (!user || !isAuthenticated) {
      loginFirst();
      return;
    }

    await voteComment(comment);
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(
      APP_NAME + "-return-url",
      location.pathname + location.search,
    );

    navigate(ROUTES.login);
  }

  return (
    <div className="w-full rounded-lg border bg-background p-2 text-muted-foreground dark:bg-muted/40">
      <p className="flex items-center capitalize tracking-tight text-primary">
        {`${comment.user.name}`}
        {comment.user.role === USER_ROLES.CONTRIBUTOR ? (
          <CheckCircle2Icon className="mx-1 inline size-3 rounded-full text-green-600" />
        ) : (
          <span className="text-muted-foreground">: </span>
        )}
      </p>
      {comment.mentionedUser && (
        <span className="capitalize italic text-sky-400">{`@${comment.mentionedUser} `}</span>
      )}
      <span className="first-letter:uppercase">{comment.content}</span>
      <Separator className="mb-2 mt-4" />
      <div className="flex items-center">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(
            (comment.date as Timestamp).toDate().toLocaleString(),
            { addSuffix: true },
          )}
          {comment.hasBeenEdited && <span> • Edited</span>}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <WTooltip content="Upvote">
              <div
                onClick={() => vote(comment)}
                className={cn(
                  "flex cursor-pointer items-center justify-center hover:text-foreground",
                  comment.isUpVoted && "text-orange-500 hover:text-orange-500",
                )}
              >
                <UpVoteIcon className="mr-2 size-3 stroke-1" />
                {comment.votesCount || 0}
              </div>
            </WTooltip>
            <WTooltip content="Reply">
              <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                <ReplyAllIcon
                  onClick={onReply}
                  className="mr-2 size-5 stroke-1"
                />
              </div>
            </WTooltip>
          </div>
          <div className="flex gap-1">
            <Separator orientation="vertical" className="h-4" />
            <DropdownMenu>
              <WTooltip content="More">
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
                </DropdownMenuTrigger>
              </WTooltip>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className=""
                forceMount
              >
                {user && user.id === comment.user.id && (
                  <>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      className="cursor-pointer"
                    >
                      <Edit3Icon className="mr-2 size-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(comment.id);
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
                    openReportDialog(post.id, comment.id);
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
  );
}

export default CommentCard;
