import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import { Link } from "react-router-dom";

function Privacy() {
  <p className="text-base text-muted-foreground"></p>;
  return (
    <>
      <div className="flex-1 p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        <div className="mb-2 flex flex-col">
          <h3 className="text-3xl font-bold tracking-tight">Privacy Policy</h3>
          <span className="text-muted-foreground">
            Last updated: August 13, 2024
          </span>
        </div>
        <p className="text-base text-muted-foreground">
          Welcome to "<span className="text-foreground">{APP_NAME}</span>" app.
          We prioritize your privacy and are committed to safeguarding your
          personal information. This Privacy Policy explains how we collect,
          use, and protect your data when you use our translation services.
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Information We Collect
        </h3>
        <div className="grid gap-2">
          <div>
            <h4 className="text-base font-bold">User Account Information:</h4>
            <p className="text-base text-muted-foreground">
              When you create an account, we collect your email address,
              username, and password to manage your account and provide
              personalized services.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold">Translation Data:</h4>
            <p className="text-base text-muted-foreground">
              Your translation history is stored under your account. This data
              is private and can only be accessed by you. It is not shared with
              third parties unless explicitly stated.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold">Cookies:</h4>
            <p className="text-base text-muted-foreground">
              We use cookies to enhance your experience, such as remembering
              your interface settings and preferences. These cookies are
              essential for providing a consistent and personalized user
              experience.
            </p>
          </div>
        </div>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          How We Use Your Information
        </h3>
        <div className="grid gap-2">
          <div>
            <h4 className="text-base font-bold">Translation History:</h4>
            <p className="text-base text-muted-foreground">
              Your translations are securely stored and associated with your
              account. This allows you to access your translations across
              devices and sessions. The stored translations are not accessible
              by others.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold">Cookies:</h4>
            <p className="text-base text-muted-foreground">
              The cookies we use are designed to remember your interface
              preferences and enhance your interaction with the app, ensuring a
              smooth and customized experience.
            </p>
          </div>
        </div>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Data Security
        </h3>
        <p className="text-base text-muted-foreground">
          We take data security seriously. Your personal information and
          translation data are encrypted and stored securely on our servers,
          which are hosted on reliable cloud platforms like Azure or Digital
          Ocean. We use industry-standard security measures to protect your data
          from unauthorized access.
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Data Retention
        </h3>
        <p className="text-base text-muted-foreground">
          Your translation data is retained as long as your account is active.
          If you choose to delete your account, all associated data, including
          translations, will be permanently removed from our servers.
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Your Rights
        </h3>
        <p className="text-base text-muted-foreground">
          <ul>
            You have the right to:
            <li className="ml-4">
              - Access your stored translations and personal data.
            </li>
            <li className="ml-4"> - Request deletion of your data.</li>
            <li className="ml-4"> - Update your personal information</li>
          </ul>
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Community Contributions
        </h3>
        <p className="text-base text-muted-foreground">
          Our app allows users to contribute to the Darija dictionary. Any
          contributions you make to improve the translation accuracy are stored
          in our database. These contributions are anonymized and used solely
          for enhancing the service.
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Changes to This Privacy Policy
        </h3>
        <p className="text-base text-muted-foreground">
          We may update this Privacy Policy from time to time to reflect changes
          in our services or legal obligations. Any updates will be posted on
          this page with an updated date.
        </p>
        <h3 className="mb-2 mt-4 text-2xl font-bold tracking-tight">
          Contact Us
        </h3>
        <p className="text-base text-muted-foreground">
          If you have any questions or concerns about this Privacy Policy or
          your data, please{" "}
          <Link className="underline hover:text-foreground" to={ROUTES.contact}>
            contact us
          </Link>
        </p>
      </div>
    </>
  );
}

export default Privacy;
