import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import DailyPlanner from "../components/DailyPlanner";
import DailyPanel from "../components/DailyPanel";
import FocusTimer from "../components/FocusTimer";

import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [focusSeconds, setFocusSeconds] = useState(0);

    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
            .then((response) => response.json())
            .then((data) => {
                console.log("Dashboard tasks:", data);
                setTasks(data);
            })
            .catch((error) => {
                console.error("Dashboard task error:", error);
            });
    }, []);

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = totalTasks - completedTasks;

    // your existing return() comes below


  return (
    < div className="app-layout">
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

              < Link to="/tasks" className="primary-button">
                + Add Task
              </Link>
          </section>


          {/* Statistics */}

          <section className="stats-grid">

            <StatsCard
              title="Tasks Completed"
              value={completedTasks}
              subtitle="Completed"
            />

              <StatsCard
                 title="Today's Tasks"
                value={totalTasks}
                subtitle={`${pendingTasks} remaining`}
            />

            <StatsCard
    title="Focus Time"
    value={`${Math.floor(focusSeconds / 60)}m`}
    subtitle="Current session"
/>

            <StatsCard
              title="Current Streak"
              value="7 days"
              subtitle="Keep going!"
            />

          </section>


          {/* Main Dashboard Grid */}
            <DailyPanel tasks={tasks}/>
            <FocusTimer
    seconds={focusSeconds}
    setSeconds={setFocusSeconds}
/>

          <section className="dashboard-grid">

            {/* Tasks */}

            <div className="tasks-section">

              <div className="section-heading">
                <div>
                  <p className="section-label">TASKS</p>
                  <h3>Today's Tasks</h3>
                </div>

                <Link to="/tasks" className="view-button">
                   View all
                </Link>
              </div>

              {tasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                time="Today"
                completed={task.completed}
               />
              ))}

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