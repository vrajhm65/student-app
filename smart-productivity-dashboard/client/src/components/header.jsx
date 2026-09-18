function Header() {
  return (
    <header className="header">
      <div className="header-copy">
        <p className="header-label">YOUR PRODUCTIVITY</p>
        <h2>Good evening 👋</h2>
        <div className="header-status">
          <span className="header-status-dot" aria-hidden="true" />
          Stay focused. Make today count.
        </div>
      </div>

      <div className="header-actions" aria-label="Quick actions">
        <button
          type="button"
          className="header-notification"
          aria-label="Notifications"
        >
          <svg className="header-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 21h4" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          className="header-profile"
          aria-label="Profile"
        >
          <span className="header-profile-avatar">U</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
