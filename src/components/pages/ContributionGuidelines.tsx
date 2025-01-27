import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import { Link } from "react-router-dom";

function Privacy() {
  <p className="text-base text-muted-foreground"></p>;
  return (
    <>
      <div
        id="contribution-guidelines"
        className="flex-1 p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed"
      >
        <div className="mb-2 flex flex-col">
          <h3 className="text-2xl font-bold tracking-tight">
            Contribution Guidelines
          </h3>
          <span className="text-muted-foreground">
            Last updated: November 6, 2024
          </span>
        </div>
        <p className="text-base text-muted-foreground">
          Welcome to "<span className="text-foreground">{APP_NAME}</span>" app.
          To ensure quality and consistency, every contribution must align with
          our guidelines to be considered. Together, we can create a more
          comprehensive and accurate translation resource that will benefit
          learners, travelers, and anyone interested in Moroccan Darija.
        </p>
        <h3 className="mb-2 mt-4 text-xl font-bold tracking-tight">
          1- Submitting Contributions
        </h3>
        <p className="text-base text-muted-foreground">
          We welcome contributions in various data file formats. You may send
          translations in CSV, XLS, JSON, or plain text files—whatever works
          best for you. Just ensure that each file includes English phrases
          alongside their Darija translations.
        </p>
        <h3 className="mb-2 mt-4 text-xl font-bold tracking-tight">
          2- Translation Standards
        </h3>
        <p className="text-base text-muted-foreground">
          To maintain consistency, we ask that all contributors follow these
          standards for representing Darija
        </p>
        <div className="mt-2 grid gap-3">
          <h4 className="text-base font-bold">
            Arabic Characters with Two-Letter Latin Equivalents:
          </h4>
          <table>
            <thead>
              <tr>
                <th>Arabic alphabet</th>
                <th>ش</th>
                <th>غ</th>
                <th>خ</th>
                <th>و</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Latin alphabet</td>
                <td>sh</td>
                <td>gh</td>
                <td>kh</td>
                <td>ou</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-base font-bold">
            Arabic Characters with Two-Letter Latin Equivalents:
          </h4>
          <table>
            <thead>
              <tr>
                <th align="center">t</th>
                <th align="center">T</th>
                <th align="center">s</th>
                <th align="center">S</th>
                <th align="center">d</th>
                <th align="center">D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center">ت</td>
                <td align="center">ط</td>
                <td align="center">س</td>
                <td align="center">ص</td>
                <td align="center">د</td>
                <td align="center">ض</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-base font-bold">
            Double Characters for Emphasis (الشدة):
          </h4>
          <table>
            <thead>
              <tr>
                <th>darija</th>
                <th>7mam</th>
                <th>7mmam</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>english</td>
                <td>pigeons</td>
                <td>bathroom</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-base font-bold">
            Avoid Adding “e” at the End of Words:
          </h4>
          <p className="text-base text-muted-foreground">
            Typically, Darija words do not end with the letter “e.” For
            instance, write "louz" instead of "louze" to keep translations as
            close to the spoken form as possible.
          </p>
          <h4 className="text-base font-bold">
            Avoid "Z" and "th" for ظ, ذ, ث:
          </h4>
          <p className="text-base text-muted-foreground">
            These characters are generally not used in standard Darija, except
            in some northern dialects. For simplicity, please use the closest
            standard sounds for clarity:
          </p>
          <table>
            <thead>
              <tr>
                <th>d</th>
                <th>t</th>
                <th>dh or D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ذ</td>
                <td>ث</td>
                <td>ظ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mb-2 mt-4 text-xl font-bold tracking-tight">
          Contact Us
        </h3>
        <p className="text-base text-muted-foreground">
          If you have any questions or concerns, please{" "}
          <Link className="underline hover:text-foreground" to={ROUTES.contact}>
            contact us
          </Link>
        </p>
      </div>
    </>
  );
}

export default Privacy;
