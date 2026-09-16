import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskResponse, planResponse, focusResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/tasks", {
              headers,
            }),
            fetch("http://localhost:5000/api/plans", {
              headers,
            }),
            fetch("http://localhost:5000/api/focus", {
              headers,
            }),
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
        console.error("Calendar data error:", error);
      }
    };

    loadData();
  }, []);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthName = selectedDate.toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const selectedDateString = formatDate(selectedDate);

  const getTaskDate = (task) => {
    if (task.completedAt) {
      return formatDate(new Date(task.completedAt));
    }

    if (task.createdAt) {
      return formatDate(new Date(task.createdAt));
    }

    return null;
  };

  const getPlanDate = (plan) => {
    if (plan.createdAt) {
      return formatDate(new Date(plan.createdAt));
    }

    return null;
  };

  const getFocusDate = (session) => {
    if (session.createdAt) {
      return formatDate(new Date(session.createdAt));
    }

    return null;
  };

  const selectedTasks = tasks.filter(
    (task) =>
      getTaskDate(task) === selectedDateString
  );

  const selectedPlans = plans.filter(
    (plan) =>
      getPlanDate(plan) === selectedDateString
  );

  const selectedFocusSessions = focusSessions.filter(
    (session) =>
      getFocusDate(session) === selectedDateString
  );

  const completedTasks = selectedTasks.filter(
    (task) => task.completed
  ).length;

  const completedPlans = selectedPlans.filter(
    (plan) => plan.completed
  ).length;

  const focusMinutes = Math.floor(
    selectedFocusSessions.reduce(
      (total, session) =>
        total + (Number(session.duration) || 0),
      0
    ) / 60
  );

  const previousMonth = () => {
    setSelectedDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setSelectedDate(
      new Date(year, month + 1, 1)
    );
  };

  const selectDay = (day) => {
    setSelectedDate(
      new Date(year, month, day)
    );
  };

  const isToday = (day) => {
    const today = new Date();

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const hasActivity = (day) => {
    const date = formatDate(
      new Date(year, month, day)
    );

    return (
      tasks.some(
        (task) => getTaskDate(task) === date
      ) ||
      plans.some(
        (plan) => getPlanDate(plan) === date
      ) ||
      focusSessions.some(
        (session) => getFocusDate(session) === date
      )
    );
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="calendar-page">

          <div className="calendar-header">
            <div>
              <p className="section-label">
                CALENDAR
              </p>

              <h1>
                {monthName} {year}
              </h1>

              <p>
                View your productivity history.
              </p>
            </div>

            <div className="calendar-controls">
              <button onClick={previousMonth}>
                ←
              </button>

              <button
                onClick={() =>
                  setSelectedDate(new Date())
                }
              >
                Today
              </button>

              <button onClick={nextMonth}>
                →
              </button>
            </div>
          </div>

          <div className="calendar-card">

            <div className="calendar-weekdays">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="calendar-grid">

              {Array.from({
                length: firstDay,
              }).map((_, index) => (
                <div
                  className="calendar-day empty"
                  key={`empty-${index}`}
                />
              ))}

              {Array.from(
                { length: daysInMonth },
                (_, index) => {
                  const day = index + 1;

                  const isSelected =
                    selectedDate.getDate() === day;

                  return (
                    <button
                      className={`calendar-day ${
                        isToday(day)
                          ? "today"
                          : ""
                      } ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      key={day}
                      onClick={() =>
                        selectDay(day)
                      }
                    >
                      <span className="day-number">
                        {day}
                      </span>

                      {hasActivity(day) && (
                        <span className="activity-dot">
                          •
                        </span>
                      )}

                      {isToday(day) && (
                        <span className="today-label">
                          Today
                        </span>
                      )}
                    </button>
                  );
                }
              )}

            </div>
          </div>

          <div className="selected-day-panel">

            <div className="selected-day-header">
              <div>
                <p className="section-label">
                  SELECTED DAY
                </p>

                <h2>
                  {selectedDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </h2>
              </div>
            </div>

            <div className="calendar-stats">

              <div className="calendar-stat">
                <span>Tasks</span>
                <strong>
                  {completedTasks} /{" "}
                  {selectedTasks.length}
                </strong>
              </div>

              <div className="calendar-stat">
                <span>Plans</span>
                <strong>
                  {completedPlans} /{" "}
                  {selectedPlans.length}
                </strong>
              </div>

              <div className="calendar-stat">
                <span>Focus</span>
                <strong>
                  {focusMinutes} min
                </strong>
              </div>

            </div>

            <div className="calendar-details">

              <div>
                <h3>Tasks</h3>

                {selectedTasks.length === 0 ? (
                  <p className="empty-state">
                    No tasks for this day.
                  </p>
                ) : (
                  selectedTasks.map((task) => (
                    <div
                      className="calendar-detail-item"
                      key={task.id}
                    >
                      <span
                        className={
                          task.completed
                            ? "completed"
                            : ""
                        }
                      >
                        {task.title}
                      </span>

                      <span>
                        {task.completed
                          ? "✓"
                          : "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h3>Daily Plans</h3>

                {selectedPlans.length === 0 ? (
                  <p className="empty-state">
                    No plans for this day.
                  </p>
                ) : (
                  selectedPlans.map((plan) => (
                    <div
                      className="calendar-detail-item"
                      key={plan.id}
                    >
                      <span>
                        {plan.time} — {plan.title}
                      </span>

                      <span>
                        {plan.completed
                          ? "✓"
                          : "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Calendar;