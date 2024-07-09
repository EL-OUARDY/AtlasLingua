import { APP_NAME } from "@/shared/constants";
import { Hash, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

function Contribution() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();
  return (
    <>
      <div className="flex h-full flex-1 flex-col items-center justify-start shadow-sm">
        {/* <div className="w-full">
          <h2 className="text-2xl font-bold tracking-tight">Contribution</h2>
          <p className="mt-1 text-muted-foreground">
            Help us bridge languages. Your input is invaluable.
          </p>
        </div>
        <Separator className="my-6" /> */}
        <div className="grid h-full w-full flex-1 gap-8 rounded-lg p-4 sm:p-6 md:gap-4 md:bg-background lg:grid-cols-[1fr_1fr]">
          <div className="h-full">
            <div className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-background/50 to-background p-6 no-underline outline-none focus:shadow-md dark:from-muted/50 dark:to-muted">
              <Hash className="h-6 w-6" />
              <div className="mb-2 mt-4 text-lg font-medium">{APP_NAME}</div>
              <p className="leading-tight text-muted-foreground">
                Contributions are crucial to the success and growth of our
                Translator. Whether you're offering translations, datasets,
                feature ideas, or other valuable input, your efforts help
                enhance our tool for everyone. <br /> We welcome contributions
                in various forms, including documents and spreadsheets. <br />
                To ensure quality and consistency, please read our{" "}
                <Link
                  className="text-secondary-foreground hover:underline"
                  to={"#"}
                >
                  Contribution Guide
                </Link>{" "}
                before submitting. Every contribution must align with our
                guidelines to be considered. Together, we can create a more
                comprehensive and accurate translation resource.
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Contribute to Our Project
              </CardTitle>
              <CardDescription>
                Join our mission to improve language learning. Contribute now!
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="type">Contribution Type</Label>
                <Input
                  id="type"
                  placeholder="e.g., Translation, Dataset, Feature Idea"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="files" className="">
                  Files
                </Label>
                <button
                  onClick={() => fileInput.current?.click()}
                  className="flex aspect-square h-24 w-full flex-col items-center justify-center rounded-md border border-dashed"
                >
                  <span className="sr-only">Upload File</span>
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="mt-2 text-xs italic text-muted-foreground">
                    {selectedFileName}
                  </span>
                </button>
                <Input
                  ref={fileInput}
                  onChange={(event) =>
                    console.log(
                      setSelectedFileName(event.target?.files?.[0].name),
                    )
                  }
                  id="files"
                  type="file"
                  className="hidden"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">
                  Description{" "}
                  <small className="text-muted-foreground">(optional)</small>
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Briefly describe your contribution"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between space-x-2">
              <Button variant="outline">Clear</Button>
              <Button>Contribute</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Contribution;
