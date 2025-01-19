import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ICommunityComment, ICommunityPost } from "@/models/Community";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { CornerDownRight, Loader2, XIcon } from "lucide-react";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { serverTimestamp } from "firebase/firestore";
import {
  generateAnonymousUsername,
  isAnonymousUsername,
  IUser,
  USER_ROLES,
} from "@/models/User";
import { toast } from "sonner";
import { useCommunity } from "@/contexts/CommunityContext";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Please write your comment" })
    .max(1000, { message: "Comment is too long" }),
  anonymous: z.boolean().default(false).optional(),
});

type ICommentValues = z.infer<typeof commentSchema>;

const defaultValues = {
  content: "",
  anonymous: false,
};

interface Props {
  post: ICommunityPost;
  comment?: ICommunityComment | null;
  onCommentCreated: (comment: ICommunityPost) => void;
  onCommentUpdated: (comment: ICommunityPost) => void;
  onClose: () => void;
  mentionedUser?: Partial<IUser> | null;
}

function CommentForm({
  post,
  comment = null,
  onCommentCreated,
  onCommentUpdated,
  onClose,
  mentionedUser = null,
}: Props) {
  const { user, isAuthenticated } = useUser();
  const { addComment, editComment } = useCommunity();

  const form = useForm<ICommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  const { setValue, getValues, reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!comment)
      setValue(
        "content",
        localStorage.getItem(`${APP_NAME}-new-comment-content-${post.id}`) ||
          "",
      );
    else {
      setValue("content", comment.content);
      setValue("anonymous", isAnonymousUsername(comment.user.name as string));
    }
    return () => {
      // Component unmounted
      // Save new comment content before leaving
      if (!comment)
        // Only save content when adding a new comment not updating it
        localStorage.setItem(
          `${APP_NAME}-new-comment-content-${post.id}`,
          getValues("content"),
        );
    };
  }, [getValues, setValue, post.id, comment]);

  async function onSubmit(data: ICommentValues) {
    if (!user || !isAuthenticated) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);

    try {
      if (comment) {
        // update comment
        // Construct an updated comment
        const commentObj: ICommunityComment = {
          ...comment,
          content: data.content,
          user: {
            id: user.id as number,
            name: data.anonymous ? generateAnonymousUsername() : user.name,
            role: user.role || USER_ROLES.MEMBER,
          },
          hasBeenEdited: true,
        };
        const updatedComment = await editComment(
          post.id,
          comment.id,
          commentObj,
        );
        reset();
        onCommentUpdated(updatedComment);
      } else {
        // Add new comment
        // Construct a new comment
        const commentObj: Omit<ICommunityComment, "id"> = {
          content: data.content,
          user: {
            id: user.id as number,
            name: data.anonymous ? generateAnonymousUsername() : user.name,
            role: user.role || USER_ROLES.MEMBER,
          },
          date: serverTimestamp(),
          votes: 0,
          mentionedUser:
            mentionedUser &&
            !isAnonymousUsername(mentionedUser.name as string) &&
            mentionedUser.id !== user.id
              ? mentionedUser.name
              : "",
        };
        const newComment = await addComment(post.id, commentObj);
        reset();
        localStorage.removeItem(`${APP_NAME}-new-comment-content-${post.id}`);
        onCommentCreated(newComment);
      }
    } catch (err) {
      toast("Can't proccess your request. Please try again!", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(
      APP_NAME + "-return-url",
      ROUTES.community + `?post_id=${post.id}&new_comment=true`,
    );
    // Save new comment content before leaving
    if (!comment)
      // Only save content when adding a new comment not updating it
      localStorage.setItem(
        `${APP_NAME}-new-comment-content-${post.id}`,
        getValues("content"),
      );
    // navigate to login
    navigate(ROUTES.login);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-3 flex items-center text-xs">
          <div className="flex items-center gap-1 italic text-muted-foreground">
            <CornerDownRight className="size-4" />
            <span>
              Replying to @
              {mentionedUser &&
              !isAnonymousUsername(mentionedUser.name as string) &&
              mentionedUser.id !== user?.id
                ? mentionedUser.name
                : post.user.name}
            </span>
          </div>
          <div
            onClick={onClose}
            className="ml-auto flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
            <span>Cancel</span>
          </div>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex h-full flex-col gap-2">
                <FormControl>
                  <Textarea
                    {...field}
                    id="comment-content"
                    className="p-4 text-sm no-ring"
                    placeholder="Write your comment"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label
                      htmlFor="anonymous"
                      className="flex cursor-pointer items-center gap-2 text-xs font-normal"
                      title="Your comment will show with an alias"
                    >
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name={field.name}
                        id="anonymous"
                        aria-label="Comment anonymously"
                      />{" "}
                      Share anonymously
                    </Label>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={isSubmitting}
              type="submit"
              size="sm"
              className="ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                <>{comment ? "Edit" : "Comment"}</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CommentForm;
