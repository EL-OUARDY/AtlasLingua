import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ROUTES } from "@/routes/routes";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  FileText,
  ImagePlay,
  FileType2,
  Paperclip,
  HistoryIcon,
} from "lucide-react";
import { Button } from "../ui/button";

const translationTypes = [
  {
    type: "Text",
    link: ROUTES.translate.index,
    description: "AI-powered",
    icon: FileType2,
  },
  {
    type: "Media",
    link: ROUTES.translate.media,
    description: "Audios, Videos",
    icon: ImagePlay,
  },
  {
    type: "Documents",
    link: ROUTES.translate.documents,
    description: ".pdf, .docx, .pptx",
    icon: Paperclip,
  },
  {
    type: "Summarization",
    link: ROUTES.translate.summarization,
    description: "Smart recap",
    icon: FileText,
  },
];

function Translator() {
  const location = useLocation();
  const currentPath =
    location.pathname !== ROUTES.home
      ? location.pathname
      : ROUTES.translate.index;

  return (
    <>
      <div className="flex h-full flex-col gap-4 overflow-auto p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        {/* <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Translator</h2>
            <p className="mt-1 text-muted-foreground">
              Accurate translations for everyday communication.
            </p>
          </div>
          <div className="ml-auto hidden shrink-0 lg:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="#" className="text-base">
                      Translator
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base">
                    English - Darija
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div> */}
        <div className="flex items-center gap-4">
          <Tabs className="flex flex-1 flex-col gap-4" value={currentPath}>
            <div className="flex items-center">
              <TabsList className="mr-auto h-fit">
                {translationTypes.map((item, index) => (
                  <Link key={index} to={item.link}>
                    <TabsTrigger
                      value={item.link}
                      className="rounded-lg px-4 text-zinc-600 dark:text-zinc-200"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="size-5 xl:size-5" />
                        <div className="hidden flex-col text-left lg:flex">
                          <span className="text-foreground">{item.type}</span>
                          <span className="text-muted-foreground xl:text-sm">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
              {currentPath === ROUTES.translate.index && (
                <Button
                  variant="outline"
                  size="icon"
                  className="dark:bg-secondary dark:hover:bg-background md:hidden landscape:flex lg:landscape:hidden"
                >
                  <HistoryIcon className="size-5" />
                </Button>
              )}
            </div>
          </Tabs>
        </div>

        <ScrollArea className="flex flex-1">
          <Outlet />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

export default Translator;
