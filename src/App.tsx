import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import Layout from "./components/pages/Layout";
import Translator from "./components/pages/Translator";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import Contact from "./components/pages/Contact";
import Dictionary from "./components/pages/Dictionary";
import Learn from "./components/pages/Learn";
import Community from "./components/pages/Community";
import Contribution from "./components/pages/Contribution";
import Feedback from "./components/pages/Feedback";
import Media from "./components/pages/Media";
import LiveAssistance from "./components/pages/LiveAssistance";
import Favorites from "./components/pages/Favorites";
import History from "./components/pages/History";
import Privacy from "./components/pages/Privacy";
import Settings from "./components/pages/Settings";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { APP_NAME } from "@/shared/constants";
import ProfileSettings from "./components/pages/settings/ProfileSettings";
import GeneralSettings from "./components/pages/settings/GeneralSettings";
import AppearanceSettings from "./components/pages/settings/AppearanceSettings";
import NotificationSettings from "./components/pages/settings/NotificationSettings";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey={APP_NAME + "-theme"}>
        <Routes>
          {/* main routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Translator />} />
            <Route path={ROUTES.translate} element={<Translator />} />
            <Route path={ROUTES.dictionary} element={<Dictionary />} />
            <Route path={ROUTES.favorites} element={<Favorites />} />
            <Route path={ROUTES.media} element={<Media />} />
            <Route path={ROUTES.learn} element={<Learn />} />
            <Route path={ROUTES.community} element={<Community />} />
            <Route path={ROUTES.live_assistance} element={<LiveAssistance />} />
            <Route path={ROUTES.contribution} element={<Contribution />} />
            <Route path={ROUTES.history} element={<History />} />
            <Route path={ROUTES.feedback} element={<Feedback />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.contact} element={<Contact />} />
            <Route path={ROUTES.privacy} element={<Privacy />} />
            <Route path={ROUTES.settings.general} element={<Settings />}>
              <Route index element={<GeneralSettings />} />
              <Route
                path={ROUTES.settings.profile}
                element={<ProfileSettings />}
              />
              <Route
                path={ROUTES.settings.appearance}
                element={<AppearanceSettings />}
              />
              <Route
                path={ROUTES.settings.notifications}
                element={<NotificationSettings />}
              />
            </Route>
            <Route path={ROUTES.notFound} element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
