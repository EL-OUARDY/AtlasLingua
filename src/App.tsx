import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import Layout from "./pages/Layout";
import Translator from "./pages/Translator";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Dictionary from "./pages/Dictionary";

function App() {
  return (
    <>
      <Routes>
        {/* main routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Translator />} />
          <Route path={ROUTES.translate} element={<Translator />} />
          <Route path={ROUTES.dictionary} element={<Dictionary />} />
          <Route path={ROUTES.about} element={<About />} />
          <Route path={ROUTES.contact} element={<Contact />} />
          <Route path={ROUTES.notFound} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
