import { NavLink } from "react-router-dom";

function Sidebar() {
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

      </div>

    </aside>
  );
}

export default Sidebar;