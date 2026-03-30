import { Link } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";  

function Sidebar({ isOpen, onClose }) {

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
          <Link to="/" className="sidebar-link" onClick={onClose}>
            Home
          </Link>

          <Link to="/ideas" className="sidebar-link" onClick={onClose}>
            Ideas
          </Link>

          <Link to={isLoggedIn ? "/create-idea" : "/signup"} className="sidebar-link" onClick={onClose}>
            Post Your Idea
          </Link>

          <Link to={ isLoggedIn ? "/ai-validator" : "/signup"} className="sidebar-link" onClick={onClose}>
            AI Validator
          </Link>
          {isLoggedIn && (
          <Link to="/my-ideas" className="sidebar-link" onClick={onClose}>
            My Ideas
          </Link>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;