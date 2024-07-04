import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ROUTES } from "@/routes/routes";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const translationTypes = [
  { type: "Text", link: ROUTES.translate.index },
  { type: "Media", link: ROUTES.translate.media },
  { type: "Documents", link: ROUTES.translate.documents },
  { type: "Summarization", link: ROUTES.translate.summarization },
];

function Translator() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath =
    location.pathname !== ROUTES.home
      ? location.pathname
      : ROUTES.translate.index;

  return (
    <>
      <div className="flex h-full flex-col gap-4 overflow-auto rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
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
        <div className="flex items-center gap-4 overflow-auto">
          <Tabs
            className="hidden w-full flex-1 flex-col gap-4 sm:flex"
            value={currentPath}
          >
            <div className="flex items-center">
              <TabsList className="mr-auto">
                {translationTypes.map((item, index) => (
                  <Link to={item.link}>
                    <TabsTrigger
                      key={index}
                      value={item.link}
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      {item.type}
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </div>
          </Tabs>
          <div className="flex w-full items-center sm:hidden">
            <h2 className="flex-1 text-2xl font-bold tracking-tight">
              Translator
            </h2>
            <Select
              value={currentPath}
              onValueChange={(link) => navigate(link)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {translationTypes.map((item, index) => (
                  <SelectItem key={index} value={item.link} className="">
                    {item.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden lg:block">
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
        </div>

        <ScrollArea className="flex-1">
          <Outlet />
        </ScrollArea>
      </div>
    </>
  );
}

export default Translator;
