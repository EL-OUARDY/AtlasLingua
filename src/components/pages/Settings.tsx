import { NavLink, Outlet } from "react-router-dom";
import { Separator } from "../ui/separator";
import { ROUTES } from "@/routes/routes";

function Settings() {
  const navLinks = [
    {
      title: "General",
      href: ROUTES.settings.general,
    },
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
  ];
  return (
    <>
      <div className="flex h-full flex-col justify-center rounded-lg border border-dashed p-6 shadow-sm sm:p-8">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="mt-1 text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex size-full flex-col lg:flex-row lg:gap-12">
          <aside
            id="settings-nav"
            className="flex flex-row flex-wrap justify-start gap-2 lg:-mx-4 lg:w-[180px] lg:flex-col"
          >
            {navLinks.map((link, index) => (
              <NavLink
                end
                key={index}
                to={link.href}
                className="flex h-10 items-center whitespace-nowrap rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {link.title}
              </NavLink>
            ))}
          </aside>
          <Separator className="my-6 lg:hidden" />

          <div className="flex w-full flex-col gap-4 lg:w-2/3">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
