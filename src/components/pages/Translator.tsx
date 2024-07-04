import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import { ROUTES } from "@/routes/routes";
import TranslateText from "../translator/TranslateTexts";
import TranslateMedia from "../translator/TranslateMedia";
import TranslateDocuments from "../translator/TranslateDocuments";
import Summarization from "../translator/Summarization";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const translationTypes = ["text", "media", "documents", "summarization"];

function Translator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTranslationType, setSelectedTranslationType] =
    useState<string>("text");

  useEffect(() => {
    // get translation type from the url
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type") || "text";
    setSelectedTranslationType(translationTypes.includes(type) ? type : "text");
  }, [location]);

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
            value={selectedTranslationType}
            onValueChange={(x) => navigate(`${ROUTES.translate}/?type=${x}`)}
          >
            <div className="flex items-center">
              <TabsList className="mr-auto">
                {translationTypes.map((t, index) => (
                  <TabsTrigger
                    key={index}
                    value={t}
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    <span className="capitalize">{t}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
          <div className="flex w-full items-center sm:hidden">
            <h2 className="flex-1 text-2xl font-bold tracking-tight">
              Translator
            </h2>
            <Select
              onValueChange={(x) => navigate(`${ROUTES.translate}/?type=${x}`)}
              value={selectedTranslationType}
            >
              <SelectTrigger className="w-[140px] capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {translationTypes.map((t, index) => (
                  <SelectItem key={index} value={t} className="capitalize">
                    {t}
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
          {selectedTranslationType === "text" && <TranslateText />}
          {selectedTranslationType === "media" && <TranslateMedia />}
          {selectedTranslationType === "documents" && <TranslateDocuments />}
          {selectedTranslationType === "summarization" && <Summarization />}
        </ScrollArea>
      </div>
    </>
  );
}

export default Translator;
