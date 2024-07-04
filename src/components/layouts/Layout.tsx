import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "@/components/SideBar";
import MobileNavigationBar from "@/components/MobileNavigationBar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useEffect, useRef } from "react";

function Layout() {
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null);
  const location = useLocation();

  useEffect(() => {
    // scroll to top everytime a new page displayed
    if (scrollAreaRef.current) {
      scrollAreaRef.current.children[1].scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location]);

  return (
    <div id="page-wrapper" className="flex h-screen w-screen bg-muted/40">
      <NotificationProvider>
        <SideBar />
        <ScrollArea className="h-screen w-screen overflow-auto">
          <section className="flex h-screen flex-1 flex-col overflow-auto md:gap-4 md:py-4">
            <Header />
            <main className="flex h-full flex-1 flex-grow flex-col gap-4 overflow-auto md:gap-6 md:p-4 md:px-6 md:py-0">
              <ScrollArea ref={scrollAreaRef} className="flex-1">
                <Outlet />
              </ScrollArea>
            </main>
            <MobileNavigationBar />
          </section>
          <ScrollBar orientation="horizontal" className="cursor-grab" />
        </ScrollArea>
        <Notifications />
      </NotificationProvider>
    </div>
  );
}

export default Layout;
