import { ROUTES } from "@/routes/routes";
import { PenLine, BookOpenIcon, RulerIcon, UsersRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isPage?: boolean;
}
function CommunityFrontPage({ isPage = false }: Props) {
  return (
    <div
      className={cn(
        "flex size-full text-center",
        isPage && "mb-4 max-w-2xl p-4",
      )}
    >
      <div className="flex flex-col rounded-lg text-center">
        <div className="mb-6 w-full rounded-lg bg-background p-4">
          <h2 className="mb-2 text-xl font-bold text-primary">
            Welcome to our Forum
          </h2>

          <p className="text-gray-400">
            Join our supportive community of language learners! Share your
            questions, experiences, and help others along the way.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to={ROUTES.community + "?new_post=true"}
            className="flex items-start rounded-lg bg-background p-4"
          >
            <PenLine className="mr-3 h-6 w-6 flex-shrink-0 text-purple-500" />
            <div className="text-left">
              <h3 className="mb-2 font-semibold text-primary">Ask Questions</h3>
              <p className="text-sm text-gray-400">
                Stuck on a difficult phrase? Need help with vocabulary or
                pronunciation? Our supportive community is ready to assist you
                with any language challenge.
              </p>
            </div>
          </Link>

          <div className="flex items-start rounded-lg bg-background p-4">
            <UsersRoundIcon className="mr-3 h-6 w-6 flex-shrink-0 text-purple-500" />
            <div className="text-left">
              <h3 className="mb-2 font-semibold text-primary">
                Practice with Others
              </h3>
              <p className="text-sm text-gray-400">
                Looking for someone to practice language with? Connect with
                other learners and start improving together.
              </p>
            </div>
          </div>

          <div className="flex items-start rounded-lg bg-background p-4">
            <BookOpenIcon className="mr-3 h-6 w-6 flex-shrink-0 text-purple-500" />
            <div className="text-left">
              <h3 className="mb-2 font-semibold text-primary">
                Share Knowledge
              </h3>
              <p className="text-sm text-gray-400">
                Discuss learning techniques, share resources, or help others
                understand tricky concepts.
              </p>
            </div>
          </div>

          <div className="flex items-start rounded-lg bg-background p-4">
            <RulerIcon className="mr-3 h-6 w-6 flex-shrink-0 text-purple-500" />
            <div className="text-left">
              <h3 className="mb-2 font-semibold text-primary">
                Forum Guidelines
              </h3>
              <p className="text-sm text-gray-400">
                We encourage respectful and supportive interactions. Keep
                discussions on topic and use appropriate language. Remember,
                we're all here to help each other learn and grow in our language
                journey.
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          className={cn(
            "m-auto mt-4 max-w-fit bg-purple-600 text-white hover:bg-purple-700",
            !isPage && "lg:hidden",
          )}
        >
          <Link to={ROUTES.community + "?new_post=true"}>Create New Post</Link>
        </Button>
      </div>
    </div>
  );
}

export default CommunityFrontPage;
