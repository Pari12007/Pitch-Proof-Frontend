import { useLanguage } from "../context/languageStore";
import { Link } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";  

function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();


  const { isLoggedIn } = useContext(AuthContext)

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">PitchProof</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={onClose}> {t("Home")} </Link>
          
          <Link to="/ideas" className="sidebar-link" onClick={onClose}> {t("Ideas")} </Link>


          <Link to={isLoggedIn ? "/create-idea" : "/signup"} className="sidebar-link" onClick={onClose}> {t("Post Your Idea")} </Link>

          {isLoggedIn && (
            <Link to="/my-ideas" className="sidebar-link" onClick={onClose}> {t("My Ideas")} </Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/workspaces/new" className="sidebar-link" onClick={onClose}>{t("Create Business")}</Link>
              <Link to="/workspaces" className="sidebar-link" onClick={onClose}>{t("My Businesses")}</Link>
            </>
          )}

          <Link to={ isLoggedIn ? "/ai-validator" : "/signup"} className="sidebar-link" onClick={onClose}> {t("AI Validator")} </Link>


        </nav>
      </aside>
    </>
  );
}

export default Sidebar;