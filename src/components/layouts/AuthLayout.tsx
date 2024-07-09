import { Button, buttonVariants } from "@/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routes";
import { APP_NAME, APP_INFO } from "@/shared/constants";
import { ChevronUp, Hash } from "lucide-react";
import { Link } from "react-router-dom";

type Role = "login" | "signup";

interface Props {
  children: React.ReactNode;
  role?: Role;
  description?: string;
}

function AuthLayout({ children, role, description }: Props) {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {role == "signup" && (
        <Link
          to={ROUTES.login}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Login
        </Link>
      )}
      {role == "login" && (
        <Link
          to={ROUTES.signup}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Sign up
        </Link>
      )}
      <Link
        to={ROUTES.home}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "font-bg absolute left-4 top-4 md:left-8 md:top-8 lg:hidden",
        )}
      >
        <Hash />
        {APP_NAME}
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <img
          src="img/placeholder.svg"
          className="absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Hash className="size-6" />
          <Link to={ROUTES.home}>{APP_NAME}</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">{description ? description : APP_INFO}</p>
            <footer className="text-sm">@{APP_NAME}</footer>
          </blockquote>
        </div>
      </div>
      <div className="w-full lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          {children}
          <div className="fixed bottom-0 left-0 flex w-full items-center justify-center pb-2 md:pb-4 lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:bg-transparent"
                >
                  <ChevronUp className="size-8 cursor-pointer" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader className="text-left">
                    <DrawerTitle className="mb-2">{APP_NAME}</DrawerTitle>
                    <DrawerDescription>
                      {description ? description : APP_INFO}
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Hide</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
