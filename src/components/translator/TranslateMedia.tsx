import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Copy, Flag, Languages, Share2Icon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import WTooltip from "../ui/custom/WTooltip";
import { ScrollArea } from "../ui/scroll-area";

function TranslateMedia() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();
  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto rounded-lg lg:h-full lg:grid-cols-2">
      <div className="flex h-full items-center justify-center rounded-lg bg-background p-6">
        <div className="flex flex-col gap-3 xl:max-w-[500px]">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Darija Social Media <br /> Audio & Video Translator
            </h2>
            <div className="my-3 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <svg
                className="size-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
              <svg
                className="size-7"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="5"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-143 145 512 512"
              >
                <g>
                  <path
                    d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
		c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
		c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
		c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
		c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"
                  />
                  <path
                    d="M146.8,313.7c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3
		c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H51.2v38.3h26.5v133h49.6v-133h39.3l2.9-38.3h-42.2v-29.9C127.3,317.4,136.5,313.7,146.8,313.7z"
                  />
                </g>
              </svg>
              <svg
                className="size-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              <svg
                className="size-7"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
                />
              </svg>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Explore Moroccan social media with our smart Darija translator.
              Quickly understand YouTube, Instagram, and Facebook content in
              English.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col">
            <div className="grid gap-2">
              <Input
                placeholder="https://youtube.com/***"
                className="no-ring"
              />
              <Button variant="secondary" className="shrink-0 text-sm">
                <Languages className="mr-1 size-4" />
                Translate
              </Button>
            </div>
          </div>

          <div className="relative my-4 flex justify-center">
            <Separator />
            <h2 className="absolute -top-3.5 rounded-lg bg-secondary px-2 py-1 text-center text-sm text-muted-foreground">
              OR
            </h2>
          </div>
          <div className="grid gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square h-16 w-full items-center justify-center gap-2 rounded-md border border-dashed p-4"
              >
                {!selectedFileName && (
                  <Upload className="size-4 text-muted-foreground" />
                )}
                <span className="text-left text-xs italic text-muted-foreground">
                  {selectedFileName || "Upload your audio/video file"}
                </span>
                <span className="sr-only">Upload File</span>
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
              <Button className="h-full" variant={"outline"}>
                Start
              </Button>
            </div>
            <small className="text-muted-foreground/50">
              We support .mp3, .mp4, .wav
            </small>
          </div>
        </div>
      </div>
      <div className="h-full overflow-auto rounded-lg bg-background p-4 md:p-6">
        <div className="flex h-full flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Output:
          </h2>
          <ScrollArea
            className="flex-1 rounded-lg bg-secondary p-4"
            thumbColor="dark:bg-secondary-foreground/10"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos illo
            nesciunt iste. Sed, consequatur eaque corporis, error odio soluta
            explicabo, placeat ipsum sequi quia voluptatibus tempora laboriosam
            aspernatur quis officia. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Eos illo nesciunt iste. Sed, consequatur eaque
            corporis, error odio soluta explicabo, placeat ipsum sequi quia
            voluptatibus tempora laboriosam aspernatur quis officia. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Eos illo nesciunt iste.
            Sed, consequatur eaque corporis, error odio soluta explicabo,
            placeat ipsum sequi quia voluptatibus tempora laboriosam aspernatur
            quis officia. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Eos illo nesciunt iste. Sed, consequatur eaque corporis, error
            odio soluta explicabo, placeat ipsum sequi quia voluptatibus tempora
            laboriosam aspernatur quis officia. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Eos illo nesciunt iste. Sed,
            consequatur eaque corporis, error odio soluta explicabo, placeat
            ipsum sequi quia voluptatibus tempora laboriosam aspernatur quis
            officia. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eos illo nesciunt iste. Sed, consequatur eaque corporis, error odio
            soluta explicabo, placeat ipsum sequi quia voluptatibus tempora
            laboriosam aspernatur quis officia. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Eos illo nesciunt iste. Sed,
            consequatur eaque corporis, error odio soluta explicabo, placeat
            ipsum sequi quia voluptatibus tempora laboriosam aspernatur quis
            officia.
          </ScrollArea>
          <div className="flex justify-end rounded-lg bg-secondary p-2">
            <Button
              variant="ghost"
              size="icon"
              className="dark:hover:bg-background/30"
            >
              <Copy className="size-5 text-muted-foreground" />
              <span className="sr-only">Copy</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="dark:hover:bg-background/30"
            >
              <Share2Icon className="size-5 text-muted-foreground" />
              <span className="sr-only">Share</span>
            </Button>
            <WTooltip side="top" content="Report Translation">
              <Button
                variant="ghost"
                size="icon"
                className="dark:hover:bg-background/30"
              >
                <Flag className="size-5 text-muted-foreground" />
                <span className="sr-only">Report Translation</span>
              </Button>
            </WTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslateMedia;
