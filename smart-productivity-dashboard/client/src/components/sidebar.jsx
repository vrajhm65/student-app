function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        SmartFlow
      </div>

      <nav className="sidebar-nav">

        <button className="sidebar-item active">
          <span>⌂</span>
          Dashboard
        </button>

        <button className="sidebar-item">
          <span>☰</span>
          Menu
        </button>

        <button className="sidebar-item">
          <span>☀</span>
          Daily
        </button>

        <button className="sidebar-item">
          <span>▣</span>
          Calendar
        </button>

      </nav>

      <div className="sidebar-bottom">

        <button className="help-button">
          <span>?</span>
          Help & Tips
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;