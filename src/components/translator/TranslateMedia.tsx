import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Languages, Upload } from "lucide-react";
import { useRef, useState } from "react";

function TranslateMedia() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();

  return (
    <div className="gap-4 overflow-auto rounded-lg md:h-full lg:w-[600px]">
      <div className="flex h-full rounded-lg bg-background p-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Darija Social Media <br /> Audio & Video Translator
              </h2>
              <div>
                <span className="inline-block rounded border border-blue-600 px-2 py-1 text-xs font-normal text-blue-600">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="my-3 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <svg
                className="size-7 fill-transparent stroke-muted-foreground stroke-[2.4]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M31.331,8.248c-.368-1.386-1.452-2.477-2.829-2.848-2.496-.673-12.502-.673-12.502-.673,0,0-10.007,0-12.502,.673-1.377,.37-2.461,1.462-2.829,2.848-.669,2.512-.669,7.752-.669,7.752,0,0,0,5.241,.669,7.752,.368,1.386,1.452,2.477,2.829,2.847,2.496,.673,12.502,.673,12.502,.673,0,0,10.007,0,12.502-.673,1.377-.37,2.461-1.462,2.829-2.847,.669-2.512,.669-7.752,.669-7.752,0,0,0-5.24-.669-7.752ZM12.727,20.758V11.242l8.364,4.758-8.364,4.758Z"></path>{" "}
              </svg>
              <svg
                className="size-7 fill-transparent stroke-muted-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z"></path>
              </svg>
              <svg
                className="size-7 fill-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0"></path>
              </svg>
              <svg
                className="size-7 fill-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M25.873,6.069c-2.619-2.623-6.103-4.067-9.814-4.069C8.411,2,2.186,8.224,2.184,15.874c-.001,2.446,.638,4.833,1.852,6.936l-1.969,7.19,7.355-1.929c2.026,1.106,4.308,1.688,6.63,1.689h.006c7.647,0,13.872-6.224,13.874-13.874,.001-3.708-1.44-7.193-4.06-9.815h0Zm-9.814,21.347h-.005c-2.069,0-4.099-.557-5.87-1.607l-.421-.25-4.365,1.145,1.165-4.256-.274-.436c-1.154-1.836-1.764-3.958-1.763-6.137,.003-6.358,5.176-11.531,11.537-11.531,3.08,.001,5.975,1.202,8.153,3.382,2.177,2.179,3.376,5.077,3.374,8.158-.003,6.359-5.176,11.532-11.532,11.532h0Zm6.325-8.636c-.347-.174-2.051-1.012-2.369-1.128-.318-.116-.549-.174-.78,.174-.231,.347-.895,1.128-1.098,1.359-.202,.232-.405,.26-.751,.086-.347-.174-1.464-.54-2.788-1.72-1.03-.919-1.726-2.054-1.929-2.402-.202-.347-.021-.535,.152-.707,.156-.156,.347-.405,.52-.607,.174-.202,.231-.347,.347-.578,.116-.232,.058-.434-.029-.607-.087-.174-.78-1.88-1.069-2.574-.281-.676-.567-.584-.78-.595-.202-.01-.433-.012-.665-.012s-.607,.086-.925,.434c-.318,.347-1.213,1.186-1.213,2.892s1.242,3.355,1.416,3.587c.174,.232,2.445,3.733,5.922,5.235,.827,.357,1.473,.571,1.977,.73,.83,.264,1.586,.227,2.183,.138,.666-.1,2.051-.839,2.34-1.649,.289-.81,.289-1.504,.202-1.649s-.318-.232-.665-.405h0Z"></path>
              </svg>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Explore Moroccan social media with our smart Darija translator.
              Quickly understand YouTube, Instagram, and Facebook content in
              English.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_.2fr]">
              <Input
                placeholder="https://youtube.com/***"
                className="no-ring"
              />
              <Button variant="default" className="shrink-0 text-sm">
                <Languages className="mr-1 size-4" />
                Translate
              </Button>
            </div>
          </div>

          <div className="relative my-4 flex justify-center">
            <Separator />
            <h2 className="absolute -top-3.5 rounded-lg bg-secondary px-2 py-1 text-center text-sm text-muted-foreground">
              OR
            </h2>
          </div>
          <div className="grid gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square h-16 w-full items-center justify-center gap-2 rounded-md border border-dashed p-4"
              >
                {!selectedFileName && (
                  <Upload className="size-4 text-muted-foreground" />
                )}
                <span className="text-left text-xs italic text-muted-foreground">
                  {selectedFileName || "Upload your audio/video file"}
                </span>
                <span className="sr-only">Upload File</span>
              </button>
              <Input
                ref={fileInput}
                onChange={(event) =>
                  console.log(
                    setSelectedFileName(event.target?.files?.[0].name),
                  )
                }
                id="files"
                type="file"
                className="hidden"
              />
              <Button className="h-full" variant={"default"}>
                <Languages className="size-5" />
              </Button>
            </div>
            <small className="text-muted-foreground/50">
              We support .mp3, .mp4, .wav
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslateMedia;
