import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function TranslateMedia() {
  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto rounded-lg lg:h-full lg:grid-cols-2">
      <div className="flex h-full items-center justify-center rounded-lg bg-background p-4 md:p-6">
        <div className="flex max-w-[450px] flex-col gap-3">
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <svg
                className="size-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
              <svg
                className="size-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <svg
                className="size-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Social Media Translation <br /> Darija Audio & Video
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore Moroccan social media with our smart Darija translator.
              Quickly understand YouTube, Instagram, and Facebook content in
              English. Connect with Morocco's online culture effortlessly.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Input
                placeholder="https://youtube.com/***"
                className="no-ring"
              />
              <Button variant="secondary" className="shrink-0">
                Translate
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col gap-4 rounded-lg bg-background p-4"></div>
    </div>
  );
}

export default TranslateMedia;
