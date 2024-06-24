import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

function Translator() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="hidden sm:block text-xl font-bold tracking-tight md:text-2xl">
          Translator
        </h1>
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
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Translate English to Darija
          </h3>
          <p className="text-sm text-muted-foreground">
            Get acurate translations with our easy-to-use application.
          </p>
        </div>
      </div>
    </>
  );
}

export default Translator;
