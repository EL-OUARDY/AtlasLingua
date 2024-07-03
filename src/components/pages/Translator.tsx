import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";

function Translator() {
  return (
    <>
      <div className="flex h-full flex-col overflow-auto rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
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
        </div>
        <Separator className="my-6" />

        <div className="grid flex-1 gap-8 overflow-auto rounded-lg md:gap-4"></div>
      </div>
    </>
  );
}

export default Translator;
