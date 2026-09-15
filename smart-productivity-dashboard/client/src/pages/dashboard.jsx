import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import StatsCard from "../components/statscard";
import TaskCard from "../components/taskcard";
import DailyPlanner from "../components/dailyplanner";
import DailyPanel from "../components/dailypanel";
import FocusTimer from "../components/focusTimer";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [focusSeconds, setFocusSeconds] = useState(0);
    const [focusSessions, setFocusSessions] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);

    const token = localStorage.getItem("token");

    // Get all tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/tasks",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log("Dashboard tasks:", data);

                if (!response.ok) {
                    console.error("Dashboard task request failed:", data);
                    setTasks([]);
                    return;
                }

                if (Array.isArray(data)) {
                    setTasks(data);
                } else {
                    console.error(
                        "Expected tasks array but received:",
                        data
                    );
                    setTasks([]);
                }
            } catch (error) {
                console.error("Dashboard task error:", error);
                setTasks([]);
            }
        };

        fetchTasks();
    }, [token]);

    // Calculate current streak
    useEffect(() => {
        if (tasks.length === 0) {
            setCurrentStreak(0);
            return;
        }

        const completedDates = [
            ...new Set(
                tasks
                    .filter(
                        (task) =>
                            task.completed &&
                            task.completedAt
                    )
                    .map((task) => {
                        const date = new Date(task.completedAt);

                        return `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                        ).padStart(2, "0")}-${String(
                            date.getDate()
                        ).padStart(2, "0")}`;
                    })
            ),
        ].sort((a, b) => new Date(b) - new Date(a));

        if (completedDates.length === 0) {
            setCurrentStreak(0);
            return;
        }

        const today = new Date();

        const todayString = `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`;

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const yesterdayString = `${yesterday.getFullYear()}-${String(
            yesterday.getMonth() + 1
        ).padStart(2, "0")}-${String(
            yesterday.getDate()
        ).padStart(2, "0")}`;

        if (
            completedDates[0] !== todayString &&
            completedDates[0] !== yesterdayString
        ) {
            setCurrentStreak(0);
            return;
        }

        let streak = 1;

        for (let i = 1; i < completedDates.length; i++) {
            const previousDate = new Date(
                completedDates[i - 1]
            );

            const currentDate = new Date(
                completedDates[i]
            );

            const difference =
                (previousDate - currentDate) /
                (1000 * 60 * 60 * 24);

            if (difference === 1) {
                streak++;
            } else {
                break;
            }
        }

        setCurrentStreak(streak);
    }, [tasks]);

    // Get focus sessions
    useEffect(() => {
        const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/focus", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
            .then((response) => response.json())
            .then((data) => {
                console.log("Focus sessions:", data);

                if (Array.isArray(data)) {
                    setFocusSessions(data);
                } else {
                    setFocusSessions([]);
                }
            })
            .catch((error) => {
                console.error(
                    "Focus session error:",
                    error
                );
                setFocusSessions([]);
            });
    }, []);

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks =
        totalTasks - completedTasks;

    const totalFocusSeconds =
        focusSessions.reduce(
            (total, session) =>
                total + session.duration,
            0
        );

    const totalFocusMinutes =
        Math.floor(totalFocusSeconds / 60);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Header />

                <main className="dashboard-content">

                    {/* Welcome */}

                    <section className="welcome-section">
                        <div>
                            <p className="section-label">
                                YOUR DAY
                            </p>

                            <h1>
                                Let's get things done.
                            </h1>

                            <p>
                                Stay focused, manage your
                                time, and make progress today.
                            </p>
                        </div>

                        <Link
                            to="/tasks"
                            className="primary-button"
                        >
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
                            value={`${totalFocusMinutes}m`}
                            subtitle="Total sessions"
                        />

                        <StatsCard
                            title="Current Streak"
                            value={`${currentStreak} days`}
                            subtitle={
                                currentStreak > 0
                                    ? "Keep going!"
                                    : "Start your streak!"
                            }
                        />

                    </section>


                    {/* Daily Focus */}

                    <DailyPanel tasks={tasks} />


                    {/* Focus Timer */}

                    <FocusTimer
                        seconds={focusSeconds}
                        setSeconds={setFocusSeconds}
                        onSessionSaved={(session) => {
                            setFocusSessions(
                                (previousSessions) => [
                                    session,
                                    ...previousSessions,
                                ]
                            );
                        }}
                    />


                    {/* Main Dashboard Grid */}

                    <section className="dashboard-grid">

                        {/* Tasks */}

                        <div className="tasks-section">

                            <div className="section-heading">

                                <div>
                                    <p className="section-label">
                                        TASKS
                                    </p>

                                    <h3>
                                        Today's Tasks
                                    </h3>
                                </div>

                                <Link
                                    to="/tasks"
                                    className="view-button"
                                >
                                    View all
                                </Link>

                            </div>


                            {tasks
                                .slice(0, 3)
                                .map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        time="Today"
                                        completed={
                                            task.completed
                                        }
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