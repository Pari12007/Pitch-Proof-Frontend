import { Link } from "react-router-dom";
import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";


const Navbar = () => {

    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">

            <h2 className="logo">PitchProof logo</h2>

            <div className="nav-links">
                <Link to = "/">Home</Link>
                <Link to = "/ideas">Ideas</Link>

                {!isLoggedIn && (
                    <>
                    <Link to = "/login">Login</Link>
                    <Link to = "/signup">Signup</Link>
                    </>
                )}

                {isLoggedIn && (
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;