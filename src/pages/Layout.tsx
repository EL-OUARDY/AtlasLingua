import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h1 className="text-2xl">Layout</h1>
      <Outlet />
    </>
  );
};

export default Layout;
