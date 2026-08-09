function DailyPlanner() {
  return (
    <section className="daily-planner">
      <div className="section-heading">
        <div>
          <p className="section-label">DAILY</p>
          <h3>Today's Plan</h3>
        </div>

        <button className="view-button">View all</button>
      </div>

      <div className="planner-item">
        <span>09:00</span>
        <div>
          <h4>Morning Study</h4>
          <p>Focus session</p>
        </div>
      </div>

      <div className="planner-item">
        <span>14:00</span>
        <div>
          <h4>Project Development</h4>
          <p>MERN Dashboard</p>
        </div>
      </div>

      <div className="planner-item">
        <span>18:00</span>
        <div>
          <h4>Review & Planning</h4>
          <p>Prepare for tomorrow</p>
        </div>
      </div>
    </section>
  );
}

export default DailyPlanner;