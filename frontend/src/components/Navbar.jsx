import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <nav className="navbar">
      {/* Logo / Title */}
      <div className="navbar-logo">
        <h2>E-Office</h2>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/academics" className={isActive("/academics")}>
            Academics
          </Link>
        </li>

        <li>
          <Link to="/placements" className={isActive("/placements")}>
            Placements
          </Link>
        </li>

        <li>
          <Link to="/library" className={isActive("/library")}>
            Library
          </Link>
        </li>
      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        {user && (
          <span className="user-name">
            👤 {user.name || "Faculty"}
          </span>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}