import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { CheckCircle2Icon, Loader2, MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import { useEffect, useState } from "react";
import { Tag, TagInput } from "emblor";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { useCommunity } from "@/contexts/CommunityContext";
import { ICommunityPost } from "@/models/Community";
import {
  generateAnonymousUsername,
  isAnonymousUsername,
  USER_ROLES,
} from "@/models/User";
import { toast } from "sonner";
import Logo from "../ui/icons/Logo";

const newPostSchema = z.object({
  content: z
    .string()
    .min(3, { message: "Post is too short" })
    .max(1000, { message: "Post is too long" }),
  anonymous: z.boolean().default(false).optional(),
  tags: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
});

type INewPost = z.infer<typeof newPostSchema>;

const defaultValues = {
  content: "",
  anonymous: false,
  tags: [] as Tag[],
};

interface Props {
  postId?: string | null;
}
function PostForm({ postId = null }: Props) {
  const { user, isAuthenticated } = useUser();
  const { addPost, editPost, getPost } = useCommunity();

  const [post, setPost] = useState<ICommunityPost | null>(null);

  const form = useForm<INewPost>({
    resolver: zodResolver(newPostSchema),
    defaultValues,
  });

  const { setValue, getValues, reset } = form;

  const [tags, setTags] = useState<Tag[]>(defaultValues.tags);
  const [tagsError, setTagsError] = useState<string>();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const p = await getPost(postId);
      if (p) {
        setPost(p);
        setValue("content", p.content);
        setValue("anonymous", isAnonymousUsername(p.user.name as string));
        if (p.tags) {
          const _tags = p.tags?.map((tag, index) => ({
            id: index.toString(),
            text: tag,
          }));
          setValue("tags", _tags);
          setTags(_tags);
        }
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    if (!postId)
      setValue(
        "content",
        localStorage.getItem(APP_NAME + "-new-post-content") || "",
      );
    return () => {
      // Component unmounted
      // Save new post content before leaving
      if (!postId && getValues("content"))
        // Only save content when adding a new post not updating it
        localStorage.setItem(
          APP_NAME + "-new-post-content",
          getValues("content"),
        );
    };
  }, [getValues, postId, setValue]);

  async function onSubmit(data: INewPost) {
    if (!user || !isAuthenticated) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);

    try {
      if (postId && post) {
        // update post
        // Construct an updated post
        const postObj: Omit<ICommunityPost, "id"> = {
          content: data.content,
          user: {
            id: user.id as number,
            name: data.anonymous ? generateAnonymousUsername() : user.name,
            role: user.role || USER_ROLES.MEMBER,
            avatar: user.avatar || "",
          },
          tags: data.tags.map((x) => x.text),
          hasBeenEdited: true,
        };

        await editPost(post.id, postObj);
        toast("Post updated successfully.", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
        setTags([]);
        reset();
        setSearchParams((prev) => {
          prev.set("post_id", postId);
          prev.delete("edit_post");
          prev.set("updated", "true");
          return prev;
        });
      } else {
        // add post
        // Construct a new post
        const postObj: Omit<ICommunityPost, "id"> = {
          content: data.content,
          tags: data.tags.map((x) => x.text),
          user: {
            id: user.id as number,
            name: data.anonymous ? generateAnonymousUsername() : user.name,
            avatar: user.avatar || "",
            role: user.role || USER_ROLES.MEMBER,
          },
        };

        await addPost(postObj);
        toast("Post created successfully.", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
        setTags([]);
        reset();
        localStorage.removeItem(APP_NAME + "-new-post-content");
        setSearchParams((prev) => {
          prev.delete("new_post");
          prev.set("created", "true");
          return prev;
        });
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
      location.pathname + location.search,
    );
    // Save new post content before leaving
    if (!postId)
      // Only save content when adding a new post not updating it
      localStorage.setItem(
        APP_NAME + "-new-post-content",
        getValues("content"),
      );
    // navigate to login
    navigate(ROUTES.login);
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    // check if Control key (or Command key on macOS) is held down and Enter is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      // submit the form
      form.handleSubmit(onSubmit)();
    }
  }

  return (
    <div className="relative flex h-full w-full min-w-[180px] flex-col rounded-lg border p-4">
      <div className="flex max-h-full flex-1 flex-col">
        <div className="flex w-full items-start pb-4">
          <div className="flex w-full items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-background dark:bg-secondary">
                {user?.name ? (
                  user?.name
                    .split(" ")
                    .slice(0, 2)
                    .map((chunk) => chunk[0])
                    .join("")
                ) : (
                  <Logo className="size-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="grid w-full gap-1">
              <div className="flex items-center">
                <div className="mr-auto flex items-center gap-1 font-semibold capitalize">
                  {user?.name || APP_NAME}
                  {user?.role === USER_ROLES.CONTRIBUTOR && (
                    <CheckCircle2Icon className="size-4 rounded-full text-green-600" />
                  )}
                </div>
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to={ROUTES.settings.profile}>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {user && isAuthenticated ? (
                  user.email
                ) : (
                  <span onClick={loginFirst} className="cursor-pointer">
                    Please sign in to post
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Separator />

        <ScrollArea className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full pt-4"
            >
              <div className="flex h-full flex-col gap-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex h-full flex-col gap-2">
                      <FormControl>
                        <Textarea
                          {...field}
                          id="post-content"
                          className="h-full p-4 text-sm no-ring"
                          placeholder={`What's in your mind?`}
                          onKeyDown={handleTextareaKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anonymous"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Label
                          htmlFor="anonymous"
                          className="flex cursor-pointer items-center gap-2 text-xs font-normal"
                          title="Your post will show with an alias"
                        >
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name={field.name}
                            id="anonymous"
                            aria-label="post anonymously"
                          />{" "}
                          Post privately
                        </Label>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="py-0 pb-4">
                      <Label htmlFor="tags" className="cursor-pointer text-xs">
                        Tags
                      </Label>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex w-full flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                              <FormControl className="w-full">
                                <TagInput
                                  {...field}
                                  placeholder="Enter a tag"
                                  tags={tags}
                                  className="max-w-2 overflow-hidden"
                                  setTags={(newTags) => {
                                    setTags(newTags as Tag[]);
                                    setValue(
                                      "tags",
                                      newTags as [Tag, ...Tag[]],
                                    );
                                  }}
                                  activeTagIndex={null}
                                  setActiveTagIndex={() => {}}
                                  truncate={25}
                                  maxTags={3}
                                  validateTag={(tag) => {
                                    if (tag.length > 35) {
                                      setTagsError(
                                        "Tags must be under 35 characters.",
                                      );
                                      return false;
                                    } else {
                                      setTagsError("");
                                      return true;
                                    }
                                  }}
                                  styleClasses={{ input: "text-xs" }}
                                />
                              </FormControl>
                              <FormDescription className="text-left text-xs font-medium">
                                {tagsError ? (
                                  <span className="text-destructive">
                                    {tagsError}
                                  </span>
                                ) : (
                                  "Add tags by typing and pressing Enter"
                                )}
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-auto flex flex-col">
                  <div className="flex items-center">
                    {postId ? (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setTags([]);
                          reset();
                          setSearchParams((prev) => {
                            prev.delete("edit_post");
                            return prev;
                          });
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setTags([]);
                          reset();
                        }}
                        variant="outline"
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      size="sm"
                      className="ml-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Please wait
                        </>
                      ) : (
                        <span>{postId ? "Edit" : "Post"}</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
}

export default PostForm;
