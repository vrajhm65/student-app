import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((error) => {
        console.error("Calendar task error:", error);
      });
  }, [token]);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = selectedDate.toLocaleString("default", {
    month: "long",
  });

  const previousMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const today = new Date();

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="calendar-page">
          <div className="calendar-header">
            <div>
              <p className="section-label">CALENDAR</p>
              <h1>{monthName} {year}</h1>
            </div>

            <div className="calendar-controls">
              <button onClick={previousMonth}>←</button>
              <button onClick={() => setSelectedDate(new Date())}>
                Today
              </button>
              <button onClick={nextMonth}>→</button>
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
              {Array.from({ length: firstDay }).map((_, index) => (
                <div className="calendar-day empty" key={`empty-${index}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;

                return (
                  <div
                    className={`calendar-day ${
                      isToday(day) ? "today" : ""
                    }`}
                    key={day}
                  >
                    <span className="day-number">{day}</span>

                    {isToday(day) && (
                      <span className="today-label">Today</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-tasks">
            <p className="section-label">YOUR TASKS</p>

            {tasks.length === 0 ? (
              <p className="empty-state">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <div className="calendar-task" key={task.id}>
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>

                  <span>
                    {task.completed ? "✓ Completed" : "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Calendar;