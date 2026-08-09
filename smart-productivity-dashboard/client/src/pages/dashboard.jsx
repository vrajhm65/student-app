import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import DailyPlanner from "../components/DailyPlanner";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="dashboard-content">

          {/* Welcome */}

          <section className="welcome-section">
            <div>
              <p className="section-label">YOUR DAY</p>
              <h1>Let's get things done.</h1>
              <p>
                Stay focused, manage your time, and make progress today.
              </p>
            </div>

            <button className="primary-button">
              + Add Task
            </button>
          </section>


          {/* Statistics */}

          <section className="stats-grid">

            <StatsCard
              title="Tasks Completed"
              value="12"
              subtitle="This week"
            />

            <StatsCard
              title="Today's Tasks"
              value="6"
              subtitle="2 remaining"
            />

            <StatsCard
              title="Focus Time"
              value="4h 20m"
              subtitle="This week"
            />

            <StatsCard
              title="Current Streak"
              value="7 days"
              subtitle="Keep going!"
            />

          </section>


          {/* Main Dashboard Grid */}

          <section className="dashboard-grid">

            {/* Tasks */}

            <div className="tasks-section">

              <div className="section-heading">
                <div>
                  <p className="section-label">TASKS</p>
                  <h3>Today's Tasks</h3>
                </div>

                <button className="view-button">
                  View all
                </button>
              </div>

              <TaskCard
                title="Complete React dashboard"
                time="10:00 AM"
                completed={true}
              />

              <TaskCard
                title="Study MongoDB"
                time="02:00 PM"
                completed={false}
              />

              <TaskCard
                title="Practice JavaScript"
                time="05:00 PM"
                completed={false}
              />

            </div>


            {/* Daily Planner */}

            <DailyPlanner />

          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;