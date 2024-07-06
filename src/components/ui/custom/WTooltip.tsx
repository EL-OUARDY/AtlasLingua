import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  content: string;
  className?: string;
  mobile?: boolean;
  side?: "top" | "right" | "bottom" | "left" | undefined;
}
function WTooltip({
  children,
  content,
  className,
  mobile = true,
  side = "top",
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(!mobile ? "hidden" : "", className)}
          side={side}
        >
          <p
            className="text-center"
            dangerouslySetInnerHTML={{ __html: content }}
          ></p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default WTooltip;
