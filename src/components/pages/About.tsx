import { Hash } from "lucide-react";
import { APP_NAME, FEATURES, GET_STARTED, APP_INFO } from "@/shared/constants";
import { Separator } from "../ui/separator";

function About() {
  return (
    <>
      <div className="flex-1 rounded-lg border border-dashed p-4 shadow-sm">
        <div className="flex size-full flex-col items-center gap-4 xl:w-5/6">
          <h2 className="self-start text-2xl font-bold tracking-tight">
            Getting started
          </h2>
          <Separator />

          <ul className="grid w-full gap-4 rounded-lg bg-background p-4 sm:p-6 lg:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <div className="h-full">
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <Hash className="h-6 w-6" />
                  <div className="mb-2 mt-4 text-lg font-medium">
                    {APP_NAME}
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    {APP_INFO}
                  </p>
                </a>
              </div>
            </li>
            {GET_STARTED.map((item, index) => (
              <li key={index} className="rounded-lg p-4 hover:bg-secondary">
                <h4 className="mb-1 text-sm font-bold">{item.title}</h4>
                <a
                  href="#"
                  className="text-sm leading-tight text-muted-foreground"
                >
                  {item.description}
                </a>
              </li>
            ))}
          </ul>

          <h2 className="self-start text-2xl font-bold tracking-tight">
            Features
          </h2>
          <Separator />

          <ul className="grid w-full gap-4 rounded-lg bg-background p-4 sm:p-6 lg:grid-cols-[1fr_1fr_1fr]">
            {FEATURES.map((item, index) => (
              <li key={index} className="rounded-lg p-4 hover:bg-secondary">
                <h4 className="mb-1 text-sm font-bold">{item.title}</h4>
                <a
                  href="#"
                  className="text-sm leading-tight text-muted-foreground"
                >
                  {item.description}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default About;
