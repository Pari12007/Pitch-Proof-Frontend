import { useLanguage } from "../context/languageStore";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const { t } = useLanguage();

    return (
        <main className="workspcaes-page">
            <span className="ws-eyebrow">
                404
            </span>
            <h1>{t("Page not found")}</h1>
            <p>{t("This page does not exist or the link is incorrect")}</p>

            <Link to="/" className="ws-button"> {t("Go home")} </Link>
        </main>
    );
}

export default NotFoundPage;