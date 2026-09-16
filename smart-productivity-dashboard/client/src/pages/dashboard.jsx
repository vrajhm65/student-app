import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import FocusTimer from "../components/FocusTimer";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadDashboardData = async () => {
    try {
      const [taskResponse, planResponse, focusResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/tasks", { headers }),
          fetch("http://localhost:5000/api/plans", { headers }),
          fetch("http://localhost:5000/api/focus", { headers }),
        ]);

      const taskData = await taskResponse.json();
      const planData = await planResponse.json();
      const focusData = await focusResponse.json();

      if (Array.isArray(taskData)) {
        setTasks(taskData);
      }

      if (Array.isArray(planData)) {
        setPlans(planData);
      }

      if (Array.isArray(focusData)) {
        setFocusSessions(focusData);
      }
    } catch (error) {
      console.error("Dashboard data error:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const completedPlans = plans.filter((plan) => plan.completed).length;

  const totalFocusSeconds = focusSessions.reduce(
    (total, session) => total + (Number(session.duration) || 0),
    0
  );

  const focusMinutes = Math.floor(totalFocusSeconds / 60);

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const planProgress =
    plans.length > 0
      ? Math.round((completedPlans / plans.length) * 100)
      : 0;

  const today = new Date();

  const dateText = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const todayPlans = plans
    .filter((plan) => {
      if (!plan.createdAt) return true;
      return formatDate(plan.createdAt) === todayDate;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="dashboard-page">

          {/* HEADER */}

          <div className="dashboard-welcome">
            <div>
              <p className="section-label">TODAY'S DASHBOARD</p>

              <h1>Good to see you.</h1>

              <p className="dashboard-date">{dateText}</p>
            </div>
          </div>


          {/* STATS */}

          <div className="dashboard-stats">

            <div className="dashboard-stat-card">
              <span>Tasks</span>

              <strong>
                {completedTasks} / {tasks.length}
              </strong>

              <small>
                {pendingTasks} pending
              </small>
            </div>


            <div className="dashboard-stat-card">
              <span>Daily Plans</span>

              <strong>
                {completedPlans} / {plans.length}
              </strong>

              <small>
                {planProgress}% completed
              </small>
            </div>


            <div className="dashboard-stat-card">
              <span>Focus Time</span>

              <strong>
                {focusMinutes}
                <small> min</small>
              </strong>

              <small>
                Total focus sessions
              </small>
            </div>


            <div className="dashboard-stat-card">
              <span>Productivity</span>

              <strong>{taskProgress}%</strong>

              <small>
                Task completion
              </small>
            </div>

          </div>


          {/* MAIN GRID */}

          <div className="dashboard-grid">

            {/* TASKS */}

            <div className="dashboard-panel">

              <div className="dashboard-panel-header">

                <div>
                  <p className="section-label">TASKS</p>

                  <h2>Your tasks</h2>
                </div>

                <a href="/tasks">View all</a>

              </div>


              {recentTasks.length === 0 ? (

                <div className="dashboard-empty">
                  <p>No tasks yet.</p>

                  <a href="/tasks">
                    Add your first task →
                  </a>
                </div>

              ) : (

                <div className="dashboard-task-list">

                  {recentTasks.map((task) => (

                    <div
                      className="dashboard-task"
                      key={task.id}
                    >

                      <div
                        className={`dashboard-task-check ${
                          task.completed ? "completed" : ""
                        }`}
                      >
                        {task.completed ? "✓" : ""}
                      </div>

                      <span
                        className={
                          task.completed
                            ? "task-completed"
                            : ""
                        }
                      >
                        {task.title}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* TODAY PLAN */}

            <div className="dashboard-panel">

              <div className="dashboard-panel-header">

                <div>
                  <p className="section-label">DAILY</p>

                  <h2>Today's plan</h2>
                </div>

                <a href="/daily">View all</a>

              </div>


              {todayPlans.length === 0 ? (

                <div className="dashboard-empty">

                  <p>Your day is empty.</p>

                  <a href="/daily">
                    Create a plan →
                  </a>

                </div>

              ) : (

                <div className="dashboard-plan-list">

                  {todayPlans.slice(0, 5).map((plan) => (

                    <div
                      className="dashboard-plan"
                      key={plan.id}
                    >

                      <span className="dashboard-plan-time">
                        {plan.time}
                      </span>

                      <span
                        className={
                          plan.completed
                            ? "task-completed"
                            : ""
                        }
                      >
                        {plan.title}
                      </span>

                      {plan.completed && (
                        <span className="dashboard-plan-check">
                          ✓
                        </span>
                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* FOCUS */}

            <div className="dashboard-panel focus-panel">

              <div className="dashboard-panel-header">

                <div>
                  <p className="section-label">FOCUS</p>

                  <h2>Focus Timer</h2>
                </div>

              </div>

              <FocusTimer />

            </div>


            {/* PRODUCTIVITY */}

            <div className="dashboard-panel">

              <div className="dashboard-panel-header">

                <div>
                  <p className="section-label">
                    PRODUCTIVITY
                  </p>

                  <h2>Today's progress</h2>
                </div>

              </div>


              <div className="productivity-progress">

                <div className="progress-heading">

                  <span>Tasks completed</span>

                  <strong>{taskProgress}%</strong>

                </div>

                <div className="dashboard-progress-bar">

                  <div
                    className="dashboard-progress-fill"
                    style={{
                      width: `${taskProgress}%`,
                    }}
                  />

                </div>

              </div>


              <div className="productivity-progress">

                <div className="progress-heading">

                  <span>Plans completed</span>

                  <strong>{planProgress}%</strong>

                </div>

                <div className="dashboard-progress-bar">

                  <div
                    className="dashboard-progress-fill"
                    style={{
                      width: `${planProgress}%`,
                    }}
                  />

                </div>

              </div>


              <div className="dashboard-motivation">

                {taskProgress === 100 && tasks.length > 0
                  ? "Excellent work. You completed all your tasks!"
                  : taskProgress >= 70
                  ? "You're making great progress. Keep going!"
                  : taskProgress >= 40
                  ? "Good start. Stay focused and keep moving."
                  : "Start small. Complete one task and build momentum."}

              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Dashboard;