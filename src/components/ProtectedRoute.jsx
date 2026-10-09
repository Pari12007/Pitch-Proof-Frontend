import { useLanguage } from "../context/languageStore";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute ({children}) {
  const { t } = useLanguage();

    const { isLoggedIn, isLoading } = useContext(AuthContext)

    if(isLoading) {
        return <p className="loading-text">{t("Checking access...")}</p>;
    }

    if(!isLoggedIn) {
        return <Navigate to="/" replace />
    }
    return children;
}

export default ProtectedRoute;
