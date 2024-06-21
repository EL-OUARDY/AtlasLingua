import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import Layout from "./pages/Layout";
import Translator from "./pages/Translator";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Dictionary from "./pages/Dictionary";
import Academy from "./pages/Academy";
import Community from "./pages/Community";
import Contribution from "./pages/Contribution";
import Feedback from "./pages/Feedback";
import Summarization from "./pages/Summarization";
import LiveAssistance from "./pages/LiveAssistance";

function App() {
  return (
    <>
      <Routes>
        {/* main routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Translator />} />
          <Route path={ROUTES.translate} element={<Translator />} />
          <Route path={ROUTES.dictionary} element={<Dictionary />} />
          <Route path={ROUTES.summarization} element={<Summarization />} />
          <Route path={ROUTES.academy} element={<Academy />} />
          <Route path={ROUTES.community} element={<Community />} />
          <Route path={ROUTES.live_assistance} element={<LiveAssistance />} />
          <Route path={ROUTES.contribution} element={<Contribution />} />
          <Route path={ROUTES.feedback} element={<Feedback />} />
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
