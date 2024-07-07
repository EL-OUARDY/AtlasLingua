import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useHistory } from "@/contexts/HistoryContext";

function TranslationHistory() {
  const { isHistoryOpen, setIsHistoryOpen } = useHistory();

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetContent className="flex h-screen flex-col">
        <SheetHeader className="">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            History
          </SheetTitle>
          <SheetDescription>Your Recent Translation History</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-auto">
          <div className="grid h-full grid-cols-1 items-center gap-4 py-4">
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
            <div className="h-8 bg-slate-500"></div>
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Clear history</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TranslationHistory;
