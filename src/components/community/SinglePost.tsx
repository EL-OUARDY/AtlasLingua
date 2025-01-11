import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import {
  CheckCircle2Icon,
  Edit3Icon,
  Flag,
  MoreVertical,
  ReplyAllIcon,
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
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useCommunity } from "@/contexts/CommunityContext";
import PostCardSkeleton from "../skeletons/PostCardSkeleton";
import SinglePostSkeleton from "../skeletons/SinglePostSkeleton";
import { Timestamp } from "firebase/firestore";
import { useShareLink } from "@/contexts/ShareLinkContext";
import { ROUTES } from "@/routes/routes";
import { useReportPost } from "@/contexts/ReportPostContext";
import { useUser } from "@/contexts/UserContext";
import CommentForm from "./CommentForm";
import UpVoteIcon from "../ui/icons/UpVoteIcon";
import WTooltip from "../ui/custom/WTooltip";
import { ICommunityComment } from "@/models/Community";
import { IUser } from "@/models/User";
import CommentCard from "./CommentCard";
import ConfirmationDialog from "../ConfirmationDialog";

interface Props {
  postId: string;
}

function SinglePost({ postId }: Props) {
  const { user } = useUser();
  const {
    post,
    fetchPost,
    comments,
    fetchComments,
    loadingComments,
    hasMoreComments,
    loadingSinglePost,
    deleteComment,
  } = useCommunity();

  const [commentToUpdate, setCommentToUpdate] =
    useState<ICommunityComment | null>(null);

  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const [isCommentFormVisible, setIsCommentFormVisible] =
    useState<boolean>(false);

  const { openShareDialog } = useShareLink();
  const { openReportDialog } = useReportPost();

  const [mentionedUser, setMentionedUser] = useState<Partial<IUser> | null>(
    null,
  );

  useEffect(() => {
    fetchPost(postId);

    setIsCommentFormVisible(false);
    const searchParams = new URLSearchParams(location.search);
    const isNewComment = searchParams.get("new_comment");
    if (isNewComment) setIsCommentFormVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  function resetCommentState() {
    setIsCommentFormVisible(false);
    setCommentToUpdate(null);
    setMentionedUser(null);
  }

  return (
    <div className="relative flex h-full w-full min-w-[180px] flex-col rounded-lg border p-4">
      {post && !loadingSinglePost ? (
        <div className="flex max-h-full flex-1 flex-col">
          <div className="flex w-full items-start pb-4">
            <div className="flex w-full items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback className="bg-background dark:bg-secondary">
                  {(post.user.name as string)
                    .split(" ")
                    .slice(0, 2)
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid w-full gap-1">
                <div className="flex items-center font-semibold">
                  <div className="mr-auto flex items-center gap-1 capitalize">
                    {post.user.name}
                    {post.user.role === "contributor" && (
                      <CheckCircle2Icon className="size-4 rounded-full text-green-600" />
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <MoreVertical className="size-4" />
                        <span className="sr-only">More</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user && user.id === post.user.id && (
                        <>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit3Icon className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Trash2Icon className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareDialog(
                            `${window.location.origin + ROUTES.community}?post_id=${post.id}`,
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
                          openReportDialog(post.id);
                        }}
                        className="cursor-pointer"
                      >
                        <Flag className="mr-2 size-4" /> Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {post.date && (
                  <div className="text-xs text-muted-foreground">
                    {(post.date as Timestamp).toDate().toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Separator />
          <ScrollArea className="overflow-auto whitespace-pre-wrap pt-4 text-sm">
            <div className="flex h-full flex-col gap-4">
              <div className="w-full rounded-lg border-0 border-l-2 border-primary/50 bg-background p-2 text-muted-foreground dark:bg-muted/40">
                <div className="flex flex-col gap-2">
                  <div className="">{post.content}</div>
                  <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                    {post.tags && post.tags.length > 0 && (
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
                    )}
                  </div>
                </div>
                <Separator className="mb-2 mt-3" />
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      (post.date as Timestamp).toDate().toLocaleString(),
                      { addSuffix: true },
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                    <WTooltip content="Upvote">
                      <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                        <UpVoteIcon className="mr-2 size-3 stroke-1" />
                        {post.votes}
                      </div>
                    </WTooltip>
                    <WTooltip content="Reply">
                      <div className="flex cursor-pointer items-center justify-center hover:text-foreground">
                        <ReplyAllIcon
                          onClick={() => {
                            setMentionedUser(null);
                            setIsCommentFormVisible(true);
                          }}
                          className="mr-2 size-5 stroke-1"
                        />
                      </div>
                    </WTooltip>
                  </div>
                </div>
              </div>
              {comments.length === 0 && !loadingComments && (
                <div className="flex size-full flex-col items-center justify-center gap-4 text-center">
                  <Separator />
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <p className="">No comments available.</p>
                  </div>
                </div>
              )}
              {comments.map((comment, index) => (
                <CommentCard
                  key={index}
                  post={post}
                  comment={comment}
                  onReply={() => {
                    setMentionedUser(comment.user);
                    setIsCommentFormVisible(true);
                  }}
                  onEdit={() => {
                    setCommentToUpdate(comment);
                    setIsCommentFormVisible(true);
                  }}
                  onDelete={(commentId) => setCommentToDelete(commentId)}
                />
              ))}

              <ConfirmationDialog
                title="Are you absolutely sure?"
                description="This action cannot be undone! This will permanently delete your account translation history."
                onOK={() => {
                  deleteComment(post.id, commentToDelete as string);
                  setCommentToDelete(null);
                }}
                onAbort={() => setCommentToDelete(null)}
                isOpen={!!commentToDelete}
              />

              {/* Show a loader while fetching comments */}
              {loadingComments &&
                Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <PostCardSkeleton
                      key={index}
                      header={false}
                      textLines={2}
                      showTags={false}
                    />
                  ))}

              <div className="w-full text-center">
                {/* "Load More" button (hidden if no more data or currently loading) */}
                {hasMoreComments && !loadingComments && (
                  <Button
                    onClick={() => {
                      fetchComments(postId);
                    }}
                    variant="outline"
                    className="max-w-fit text-xs"
                  >
                    Load More
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>

          {isCommentFormVisible && (
            <>
              <Separator className="mt-auto" />
              <div className="pt-4">
                <CommentForm
                  post={post}
                  comment={commentToUpdate}
                  mentionedUser={mentionedUser}
                  onCommentCreated={resetCommentState}
                  onCommentUpdated={resetCommentState}
                  onClose={resetCommentState}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <SinglePostSkeleton />
      )}
    </div>
  );
}

export default SinglePost;
