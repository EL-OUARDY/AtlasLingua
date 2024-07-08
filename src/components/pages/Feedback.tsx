import { APP_NAME } from "@/shared/constants";
import { Separator } from "../ui/separator";
import { Hash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

function Feedback() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-start p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="w-full">
        <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
        <p className="mt-1 text-muted-foreground">
          Share Your Thoughts: Help Us Improve Together.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid h-full w-full gap-8 rounded-lg bg-background p-4 sm:p-6 md:gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="h-full">
          <div className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <Hash className="h-6 w-6" />
            <div className="mb-2 mt-4 text-lg font-medium">{APP_NAME}</div>
            <p className="leading-tight text-muted-foreground">
              Feedback is vital to the growth and improvement of our Translator.
              Your insights help us refine our translations, enhance user
              experience, and add features that matter most to you. As language
              is dynamic and nuanced, your input ensures our app stays accurate
              and relevant. Whether you're a native Darija speaker, an English
              learner, or somewhere in between, your perspective is invaluable.
              By sharing your thoughts, you're not just helping us – you're
              contributing to a community resource that bridges cultures and
              facilitates communication. Every comment, suggestion, or report
              you provide plays a crucial role in making this tool more
              effective for everyone.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Share Your Feedback
            </CardTitle>
            <CardDescription>
              What aspect of the app would you like to comment on?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter feedback subject" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Please include all information relevant to your feedback."
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button variant="outline">Clear</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Feedback;
