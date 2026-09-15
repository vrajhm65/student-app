
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="logo">
        SmartFlow
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className="sidebar-item"
        >
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className="sidebar-item"
        >
          <span>☰</span>
          Menu
        </NavLink>

        <NavLink
          to="/daily"
          className="sidebar-item"
        >
          <span>☀</span>
          Daily
        </NavLink>

        <NavLink
          to="/calendar"
          className="sidebar-item"
        >
          <span>▣</span>
          Calendar
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className="help-button"
        >
          <span>?</span>
          Help & Tips
        </NavLink>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;

