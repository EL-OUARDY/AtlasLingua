import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { APP_NAME } from "@/shared/constants";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";
import MobileNavigationBar from "@/components/MobileNavigationBar";
import { NotificationProvider } from "@/contexts/NotificationContext";

function Layout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey={APP_NAME + "-theme"}>
      <ScrollArea className="h-screen w-screen">
        <div id="page-wrapper" className="flex min-h-screen w-full bg-muted/40">
          <NotificationProvider>
            <SideBar />
            <section className="h-screen flex flex-col sm:gap-4 sm:py-4 flex-1">
              <Header />
              <ScrollArea className="h-full">
                <main className="h-full flex flex-grow flex-col flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-6">
                  <Outlet />
                </main>
              </ScrollArea>
              <MobileNavigationBar />
            </section>
            <Notifications />
          </NotificationProvider>
        </div>
      </ScrollArea>
    </ThemeProvider>
  );
}

export default Layout;
