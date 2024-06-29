import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useRef } from "react";

interface Props {
  links: string[];
  selected?: string;
  onChange: (link: string) => void;
  className: string;
}
function ScrollableMenu({ links, selected, onChange, className }: Props) {
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null);
  const scrollStep = 200;

  function moveScroll(step: number) {
    scrollAreaRef?.current?.children[1].scrollBy({
      left: step,
      behavior: "smooth",
    });
  }
  return (
    <div className={className}>
      <div
        onClick={() => moveScroll(-scrollStep)}
        className="flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 capitalize hover:bg-secondary"
      >
        <ChevronLeft />
      </div>
      <ScrollArea ref={scrollAreaRef} className="grid grid-cols-1 gap-4">
        <div className="flex gap-4 py-1">
          {links.map((link, index) => (
            <div
              key={index}
              onClick={() => onChange(link)}
              className={`${selected === link && "bg-background"} cursor-pointer rounded-lg border px-3 py-2 capitalize hover:bg-secondary`}
            >
              {link}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="cursor-grab" />
      </ScrollArea>
      <div
        onClick={() => moveScroll(scrollStep)}
        className="flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 capitalize hover:bg-secondary"
      >
        <ChevronRight />
      </div>
    </div>
  );
}

export default ScrollableMenu;
