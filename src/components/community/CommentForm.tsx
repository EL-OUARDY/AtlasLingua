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
import { Loader2 } from "lucide-react";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { serverTimestamp } from "firebase/firestore";
import { ANONYMOUS_NAME, USER_ROLES } from "@/models/User";
import { toast } from "sonner";
import { useCommunity } from "@/contexts/CommunityContext";

interface Props {
  post: ICommunityPost;
  comment?: ICommunityComment;
  onCommentSuccess: (comment: ICommunityPost) => void;
  mentionedUser?: string;
}

const commentSchema = z.object({
  content: z
    .string()
    .min(3, { message: "Comment is too short" })
    .max(1000, { message: "Comment is too long" }),
  anonymous: z.boolean().default(false).optional(),
});

type ICommentValues = z.infer<typeof commentSchema>;

const defaultValues = {
  content: "",
  anonymous: false,
};

function CommentForm({
  post,
  comment = null,
  onCommentSuccess,
  mentionedUser = "",
}: Props) {
  const { user, isAuthenticated } = useUser();
  const { addComment } = useCommunity();

  const form = useForm<ICommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  const { setValue, getValues, reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(
      "content",
      localStorage.getItem(`${APP_NAME}-new-comment-content-${post.id}`) || "",
    );
    return () => {
      // Component unmounted
      // Save new comment content before leaving
      localStorage.setItem(
        `${APP_NAME}-new-comment-content-${post.id}`,
        getValues("content"),
      );
    };
  }, [getValues, setValue, post.id]);

  useEffect(() => {
    if (mentionedUser && mentionedUser !== ANONYMOUS_NAME)
      setValue("content", `@${mentionedUser} `);
    else setValue("content", "");
  }, [mentionedUser, setValue]);

  async function onSubmit(data: ICommentValues) {
    if (!user || !isAuthenticated) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);
    // Construct a new comment
    const comment: Omit<ICommunityComment, "id"> = {
      content: data.content,
      user: {
        id: user.id as number,
        name: data.anonymous ? ANONYMOUS_NAME : user.name,
        role: user.role || USER_ROLES.MEMBER,
      },
      date: serverTimestamp(),
      votes: 0,
    };

    try {
      const newComment = await addComment(post.id, comment);
      toast("Comment created successfully.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
      reset();
      localStorage.removeItem(`${APP_NAME}-new-comment-content-${post.id}`);
      onCommentSuccess(newComment);
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
                    placeholder={`Reply to ${post.user.name}...`}
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
