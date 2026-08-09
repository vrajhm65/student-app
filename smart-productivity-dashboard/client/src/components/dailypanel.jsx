function DailyPanel() {
  return (
    <section className="daily-panel">
      <div className="daily-panel-header">
        <div>
          <p className="section-label">DAILY FOCUS</p>
          <h2>Make today count.</h2>
        </div>

        <span className="daily-date">
          Today
        </span>
      </div>

      <div className="daily-progress">
        <div className="progress-info">
          <span>Today's progress</span>
          <strong>4 / 6 tasks</strong>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="daily-focus">
        <span className="focus-icon">★</span>

        <div>
          <p className="section-label">MAIN FOCUS</p>
          <h3>Complete your MERN project</h3>
          <p>
            Stay focused on the most important task of the day.
          </p>
        </div>
      </div>
    </section>
  );
}

export default DailyPanel;