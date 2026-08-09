function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        SmartFlow
      </div>

      <nav className="sidebar-nav">
        <button>Dashboard</button>
        <button>Tasks</button>
        <button>Calendar</button>
        <button>Daily</button>
        <button>Settings</button>
      </nav>

      <div className="sidebar-bottom">
        <button>?</button>
      </div>
    </aside>
  );
}

export default Sidebar;