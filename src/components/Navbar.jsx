import { Link } from "react-router-dom";
import { useContext, useState } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/languageStore";


const Navbar = ({ onMenuClick, onClose }) => {

    const { language, changeLanguage, t } = useLanguage();
    const { isLoggedIn, user } = useContext(AuthContext);
    const profileInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
    const [showCategories, setShowCategories] = useState(false);

    const categories = [
    "Fintech",
    "HealthTech",
    "EdTech",
    "SaaS",
    "E-commerce",
    "GreenTech",
    "Proptech",
    "AdTech",
    "InsurTech",
    "Logistics",
    "Marketplace",
    "D2C",
    "B2B",
    "B2C",
    "Social Impact",
    "Lifestyle",
    "Scalable Startup",
    "Small Business",
    "AgriTech",
    "Cybersecurity",
    ];

    return (
        <nav className="navbar">
            {/* LEFT */}
            <div className="navbar-left">
                <button className="menu-button" aria-label={t("openMenu")} onClick={onMenuClick}>
                    ☰
                </button>
                <Link to="/" className="logo-link">
                    <h2 className="logo">PitchProof</h2>
                </Link>
            </div>


            {/* CENTER */}
            <div className="navbar-center">
                <Link to="/ideas" className="nav-link">{t("ideas")}</Link>


                <div
                    className="categories-dropdown"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                >
                    <button
                        type="button"
                        className={`categories-trigger ${showCategories ? "open" : ""}`}
                    >
                        {t("categories")}
                    </button>

                    {showCategories && (
                        <div className="categories-menu">
                            <div className="categories-menu-top">
                                <p className="categories-menu-title">{t("browseCategories")}</p>
                                <Link
                                    to="/ideas"
                                    className="categories-reset-link"
                                    onClick={() => setShowCategories(false)}
                                >
                                    {t("allCategories")}
                                </Link>
                            </div>

                            <div className="categories-grid-list">
                            {categories.map((category) => (
                                <Link
                                key={category}
                                to={`/ideas/category/${encodeURIComponent(category)}`}
                                className="categories-item"
                                onClick={() => setShowCategories(false)}
                                >
                                    {t(category)}
                                </Link>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
                    <Link to={isLoggedIn ? "/create-idea" : "/signup"} onClick={onClose} className="nav-link">{t("postIdea")}</Link>
                    {isLoggedIn && <Link to="/workspaces" className="nav-link">{t("businesses")}</Link>}
            </div>


            {/* RIGHT */}
            <div className="navbar-right">
                <select
                    className="language-select"
                    aria-label={t("language")}
                    value={language}
                    onChange={(event) => changeLanguage(event.target.value)}
                >
                    <option value="en" lang="en">English</option>
                    <option value="es" lang="es">Español</option>
                </select>
            {!isLoggedIn ? (
                <>
                    <Link to="/login" className="nav-link">{t("login")}</Link>
                    <Link to="/signup" className="nav-button">{t("signup")}</Link>
                </>
        ) : (
            <Link to="/profile" className="profile-nav-link">
                <span className="profile-nav-avatar">{profileInitial}</span>
                <span className="profile-nav-text">{t("profile")}</span>
            </Link>
        )}
            </div>
        </nav>
    )
}

export default Navbar;
