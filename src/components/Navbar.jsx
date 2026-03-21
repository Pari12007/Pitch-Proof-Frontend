import { Link } from "react-router-dom";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";


const Navbar = ({ onMenuClick, onClose }) => {

    const { isLoggedIn,} = useContext(AuthContext);

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
            </div>


            {/* RIGHT */}
            <div className="navbar-right">
            {!isLoggedIn ? (
                <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-button">Sign Up</Link>
                </>
        ) : (
            <Link to="/profile" className="nav-button">
                👤
            </Link>
        )}
            </div>
        </nav>
    )
}

export default Navbar;