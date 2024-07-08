import { Language } from "@/models/Translator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import USAIcon from "../ui/icons/USA";
import MoroccoIcon from "../ui/icons/Morocco";
import { Button } from "../ui/button";
import { Copy, CornerDownLeft, Flag, Share2Icon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import WTooltip from "../ui/custom/WTooltip";

function Summarization() {
  const [sourceLang, setSourceLang] = useState<Language>("english");
  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto rounded-lg lg:h-full lg:grid-cols-2">
      <div className="flex h-full flex-col gap-4 rounded-lg bg-background p-4">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Summarization
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get quick and accurate summaries of Darija content in English with
            our smart summarization tool. Save time by skipping full text
            translation. Our advanced technology picks out the most important
            information, giving you short and relevant summaries.
          </p>
        </div>
        <Separator />
        <Select
          value={sourceLang}
          onValueChange={(link) => setSourceLang(link as Language)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">
              <div className="flex w-full items-center gap-2 text-base font-bold">
                <USAIcon className="size-4" /> <span>English</span>
              </div>
            </SelectItem>
            <SelectItem value="darija">
              <div className="flex w-full items-center gap-2 text-base font-bold">
                <MoroccoIcon className="size-4" />
                <span>Darija</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          className="no-ring min-h-[150px] flex-1 bg-secondary px-4 py-2"
          id="summary"
          placeholder="Please include the text you want to summarize."
        />
        <Button type="submit" size="sm" className="ml-auto gap-1.5">
          Summarize
          <CornerDownLeft className="size-4" />
        </Button>
      </div>
      <div className="h-full overflow-auto rounded-lg bg-background p-4">
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

export default Summarization;
