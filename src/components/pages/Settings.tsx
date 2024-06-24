import { NavLink, Outlet } from "react-router-dom";
import { Separator } from "../ui/separator";
import { ROUTES } from "@/routes/routes";

function Settings() {
  const navLinks = [
    {
      title: "Profile",
      href: ROUTES.settings.profile,
    },
    {
      title: "Appearance",
      href: ROUTES.settings.appearance,
    },
    {
      title: "Notifications",
      href: ROUTES.settings.notifications,
    },
    {
      title: "Account",
      href: "/",
    },
  ];
  return (
    <>
      <div className="flex flex-col h-full p-6 sm:p-8 justify-center rounded-lg border border-dashed shadow-sm">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="size-full flex flex-col lg:gap-12 lg:flex-row">
          <aside className="flex flex-wrap flex-row justify-start lg:flex-col gap-2 lg:-mx-4 lg:w-[180px]">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                className="flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 bg-muted hover:bg-muted"
              >
                {link.title}
              </NavLink>
            ))}
          </aside>
          <Separator className="my-6 lg:hidden" />

          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
