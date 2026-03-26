import { Link } from "react-router-dom";
import { useContext, useState } from "react"; 
import { AuthContext } from "../context/AuthContext";


const Navbar = ({ onMenuClick, onClose }) => {

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
                <button className="menu-button" onClick={onMenuClick}>
                    ☰
                </button>
                <Link to="/" className="logo-link">
                    <h2 className="logo">PitchProof</h2>
                </Link>
            </div>


            {/* CENTER */}
            <div className="navbar-center">
                <Link to="/ideas" className="nav-link">Ideas</Link>
                <Link to={isLoggedIn ? "/create-idea" : "/signup"} onClick={onClose} className="nav-link">Post your Idea</Link> 

                <div
                    className="categories-dropdown"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                >
                    <button
                        type="button"
                        className={`categories-trigger ${showCategories ? "open" : ""}`}
                    >
                        Categories
                    </button>

                    {showCategories && (
                        <div className="categories-menu">
                            <div className="categories-menu-top">
                                <p className="categories-menu-title">Browse by category</p>
                                <Link
                                    to="/ideas"
                                    className="categories-reset-link"
                                    onClick={() => setShowCategories(false)}
                                >
                                    All Categories
                                </Link>
                            </div>

                            <div className="categories-grid-list">
                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    to={`/ideas?category=${encodeURIComponent(category)}`}
                                    className="categories-item"
                                    onClick={() => setShowCategories(false)}
                                >
                                    {category}
                                </Link>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* RIGHT */}
            <div className="navbar-right">
            {!isLoggedIn ? (
                <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-button">Sign Up</Link>
                </>
        ) : (
            <Link to="/profile" className="profile-nav-link">
                <span className="profile-nav-avatar">{profileInitial}</span>
                <span className="profile-nav-text">Profile</span>
            </Link>
        )}
            </div>
        </nav>
    )
}

export default Navbar;
