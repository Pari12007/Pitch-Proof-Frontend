import { Link } from "react-router-dom";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";


const Navbar = () => {

    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link">
                    <h2 className="logo">PitchProof</h2>
                </Link>
            </div>

            <div className="navbar-right">
                <Link to="/ideas" className="nav-link">Ideas</Link>
                <Link to="/create-idea" className="nav-link">Create Idea</Link>

            {!isLoggedIn ? (
                <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-button">Sign Up</Link>
                </>
        ) : (
            <button onClick={logout} className="nav-button logout-btn">
                Logout
             </button>
        )}
            </div>
        </nav>
    )
}

export default Navbar;