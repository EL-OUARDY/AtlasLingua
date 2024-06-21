import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeProvider } from "@/contexts/theme-provider";
import { APP_NAME } from "@/shared/constants";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";

function Layout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey={APP_NAME + "-theme"}>
      <ScrollArea className="h-screen w-screen selection:bg-secondary selection:text-foreground">
        <div id="page-wrapper" className="flex min-h-screen w-full bg-muted/40">
          <SideBar />
          <div className="h-screen flex flex-col sm:gap-4 sm:py-4 flex-1">
            <Header />
            <main className="flex flex-col flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-6">
              <Outlet />
            </main>
          </div>
        </div>
      </ScrollArea>
    </ThemeProvider>
  );
}

export default Layout;
