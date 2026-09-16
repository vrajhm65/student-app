import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import FocusTimer from "../components/FocusTimer";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [focusSeconds, setFocusSeconds] = useState(0);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [tasksRes, plansRes, focusRes] = await Promise.all([
          fetch("http://localhost:5000/api/tasks", {
            headers: authHeaders,
          }),
          fetch("http://localhost:5000/api/plans", {
            headers: authHeaders,
          }),
          fetch("http://localhost:5000/api/focus", {
            headers: authHeaders,
          }),
        ]);

        const tasksData = await tasksRes.json();
        const plansData = await plansRes.json();
        const focusData = await focusRes.json();

        if (Array.isArray(tasksData)) setTasks(tasksData);
        if (Array.isArray(plansData)) setPlans(plansData);
        if (Array.isArray(focusData)) setFocusSessions(focusData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      }
    };

    loadDashboard();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const completedPlans = plans.filter((plan) => plan.completed).length;

  const totalFocusSeconds = focusSessions.reduce(
    (total, session) => total + Number(session.duration || 0),
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

      const toggleTask = async (task) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Task update failed:", result);
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((currentTask) =>
        currentTask.id === task.id ? result.task : currentTask
      )
    );
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const editTask = async (task) => {
  const newTitle = prompt("Edit task:", task.title);

  if (!newTitle || !newTitle.trim()) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Task edit failed:", result);
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((currentTask) =>
        currentTask.id === task.id ? result.task : currentTask
      )
    );
  } catch (error) {
    console.error("Error editing task:", error);
  }
};

const deleteTask = async (task) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${task.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Task delete failed:", result);
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter(
        (currentTask) => currentTask.id !== task.id
      )
    );
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

  const today = new Date();

  const dateText = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));

  const todayString = formatDate(today);

  const todayPlans = plans
    .filter((plan) => {
      if (!plan.createdAt) return true;
      return formatDate(plan.createdAt) === todayString;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="dashboard-page">

          {/* TOP */}

          <div className="dashboard-top">
            <div>
              <span className="dashboard-eyebrow">
                TODAY'S DASHBOARD
              </span>

              <h1>Good to see you.</h1>

              <p>{dateText}</p>
            </div>

            <Link to="/tasks" className="dashboard-action">
              + Add task
            </Link>
          </div>


          {/* OVERVIEW */}

          <div className="overview-grid">

            <div className="overview-card">
              <div className="overview-card-top">
                <span>Tasks</span>
                <span className="overview-icon">✓</span>
              </div>

              <div className="overview-value">
                {completedTasks}
                <span>/ {tasks.length}</span>
              </div>

              <div className="overview-meta">
                completed
              </div>
            </div>


            <div className="overview-card">
              <div className="overview-card-top">
                <span>Daily plans</span>
                <span className="overview-icon">◷</span>
              </div>

              <div className="overview-value">
                {completedPlans}
                <span>/ {plans.length}</span>
              </div>

              <div className="overview-meta">
                completed
              </div>
            </div>


            <div className="overview-card">
              <div className="overview-card-top">
                <span>Focus time</span>
                <span className="overview-icon">◉</span>
              </div>

              <div className="overview-value">
                {focusMinutes}
                <span> min</span>
              </div>

              <div className="overview-meta">
                total sessions
              </div>
            </div>


            <div className="overview-card">
              <div className="overview-card-top">
                <span>Productivity</span>
                <span className="overview-icon">↗</span>
              </div>

              <div className="overview-value">
                {taskProgress}
                <span>%</span>
              </div>

              <div className="overview-meta">
                task completion
              </div>
            </div>

          </div>


          {/* CONTENT */}

          <div className="dashboard-content-grid">

            {/* TODAY */}

            <section className="dashboard-section schedule-section">

              <div className="dashboard-section-heading">
                <div>
                  <span className="dashboard-eyebrow">
                    SCHEDULE
                  </span>

                  <h2>Today's plan</h2>
                </div>

                <Link to="/daily">
                  View daily →
                </Link>
              </div>


              {todayPlans.length === 0 ? (

                <div className="dashboard-empty">
                  <div className="empty-line" />

                  <h3>No plans scheduled</h3>

                  <p>
                    Add activities to organize your day.
                  </p>

                  <Link to="/daily">
                    Create a plan
                  </Link>
                </div>

              ) : (

                <div className="schedule-list">

                  {todayPlans.slice(0, 6).map((plan) => (

                    <div
                      className={`schedule-item ${
                        plan.completed ? "is-complete" : ""
                      }`}
                      key={plan.id}
                    >

                      <span className="schedule-time">
                        {plan.time}
                      </span>

                      <span className="schedule-line" />

                      <div className="schedule-content">

                        <span className="schedule-title">
                          {plan.title}
                        </span>

                        {plan.completed && (
                          <span className="schedule-status">
                            Completed
                          </span>
                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>


            {/* TASKS */}

            <section className="dashboard-section tasks-section">

              <div className="dashboard-section-heading">

                <div>
                  <span className="dashboard-eyebrow">
                    TASKS
                  </span>

                  <h2>Recent tasks</h2>
                </div>

                <Link to="/tasks">
                  View all →
                </Link>

              </div>


              {tasks.length === 0 ? (

                <div className="dashboard-empty">
                  <div className="empty-line" />

                  <h3>Your task list is empty</h3>

                  <p>
                    Add something you want to accomplish.
                  </p>

                  <Link to="/tasks">
                    Create a task
                  </Link>
                </div>

              ) : (

                <div className="task-preview-list">

                  {tasks.slice(0, 6).map((task) => (

                    <div
                      className={`task-preview ${
                        task.completed ? "is-completed" : ""
                      }`}
                      key={task.id}
                    >

                      <button
                        type="button"
                        className={`task-check-button ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => toggleTask(task)}
                        aria-label={
                          task.completed
                            ? "Mark task as pending"
                            : "Mark task as completed"
                        }
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="task-preview-main">
                        <span
                          className={
                            task.completed
                              ? "task-preview-title completed"
                              : "task-preview-title"
                          }
                        >
                          {task.title}
                        </span>

                        <span className="task-preview-state">
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="task-preview-actions">
                        <button
                          type="button"
                          onClick={() => editTask(task)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTask(task)}
                        >
                          Delete
                        </button>
                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>


            {/* FOCUS */}

            <section className="dashboard-section focus-section">

              <div className="dashboard-section-heading">

                <div>
                  <span className="dashboard-eyebrow">
                    FOCUS
                  </span>

                  <h2>Deep work</h2>
                </div>

              </div>

              <div className="focus-timer-wrapper">
                <FocusTimer
  seconds={focusSeconds}
  setSeconds={setFocusSeconds}
  onSessionSaved={(session) => {
    setFocusSessions((previousSessions) => [
      ...previousSessions,
      session,
    ]);
  }}
/>
              </div>

            </section>


            {/* PROGRESS */}

            <section className="dashboard-section progress-section">

              <div className="dashboard-section-heading">

                <div>
                  <span className="dashboard-eyebrow">
                    PROGRESS
                  </span>

                  <h2>Today's performance</h2>
                </div>

                <Link to="/calendar">
                  History →
                </Link>

              </div>


              <div className="metric-row">

                <div className="metric-label">
                  <span>Tasks</span>
                  <strong>{taskProgress}%</strong>
                </div>

                <div className="metric-bar">
                  <span
                    style={{
                      width: `${taskProgress}%`,
                    }}
                  />
                </div>

              </div>


              <div className="metric-row">

                <div className="metric-label">
                  <span>Daily plans</span>
                  <strong>{planProgress}%</strong>
                </div>

                <div className="metric-bar">
                  <span
                    style={{
                      width: `${planProgress}%`,
                    }}
                  />
                </div>

              </div>


              <div className="progress-message">

                <span className="message-mark">✦</span>

                <p>
                  {taskProgress === 100 && tasks.length > 0
                    ? "Everything on your task list is complete."
                    : taskProgress >= 70
                    ? "You're making solid progress today."
                    : taskProgress >= 40
                    ? "You're building momentum. Keep going."
                    : "Start with one task and build momentum."}
                </p>

              </div>

            </section>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Dashboard;