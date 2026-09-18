import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Tasks request failed:", data);
          setTasks([]);
          return;
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const pendingCount = tasks.length - completedCount;

  const progress =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const addTask = async (event) => {
    event.preventDefault();

    const title = newTaskTitle.trim();
    if (!title) return;

    try {
      setSaving(true);

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          completed: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Add task failed:", result);
        return;
      }

      setTasks((previousTasks) => [...previousTasks, result.task]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setSaving(false);
    }
  };

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

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title || "");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const saveEdit = async (task) => {
    const title = editingTitle.trim();
    if (!title) return;

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Edit failed:", result);
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.map((currentTask) =>
          currentTask.id === task.id ? result.task : currentTask
        )
      );

      cancelEditing();
    } catch (error) {
      console.error("Error editing task:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm(
      `Delete “${task.title}”? This action cannot be undone.`
    );

    if (!confirmed) return;

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
        console.error("Delete failed:", result);
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.filter((currentTask) => currentTask.id !== task.id)
      );

      if (editingTaskId === task.id) {
        cancelEditing();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="tasks-page tasks-page-redesign">
          <div className="tasks-page-header">
            <div>
              <span className="dashboard-eyebrow">YOUR WORK</span>
              <h1>Tasks</h1>
              <p>Capture what needs to get done and keep your day moving.</p>
            </div>
          </div>

          <section className="tasks-overview">
            <div className="tasks-overview-card tasks-overview-main">
              <div className="tasks-overview-top">
                <div>
                  <span className="tasks-overview-label">TODAY'S PROGRESS</span>
                  <h2>{progress}% complete</h2>
                </div>
                <div className="tasks-progress-ring" aria-label={`${progress}% complete`}>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="tasks-progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>

              <p>
                {tasks.length === 0
                  ? "Add your first task to start your day."
                  : progress === 100
                  ? "Everything is complete. Nice work."
                  : `${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} still to go.`}
              </p>
            </div>

            <div className="tasks-overview-card tasks-count-card">
              <span className="tasks-overview-label">TOTAL</span>
              <strong>{tasks.length}</strong>
              <span>Tasks</span>
            </div>

            <div className="tasks-overview-card tasks-count-card">
              <span className="tasks-overview-label">DONE</span>
              <strong>{completedCount}</strong>
              <span>Completed</span>
            </div>

            <div className="tasks-overview-card tasks-count-card">
              <span className="tasks-overview-label">NEXT</span>
              <strong>{pendingCount}</strong>
              <span>Remaining</span>
            </div>
          </section>

          <section className="task-composer-card">
            <div className="task-composer-copy">
              <span className="tasks-overview-label">QUICK ADD</span>
              <h2>What needs to be done?</h2>
            </div>

            <form className="task-composer-form" onSubmit={addTask}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="e.g. Finish MERN dashboard UI"
                aria-label="New task title"
                maxLength={200}
              />
              <button type="submit" disabled={saving || !newTaskTitle.trim()}>
                {saving ? "Adding..." : "+ Add task"}
              </button>
            </form>
          </section>

          <section className="tasks-list-section">
            <div className="tasks-list-heading">
              <div>
                <span className="tasks-overview-label">TASK LIST</span>
                <h2>All tasks</h2>
              </div>
              <span className="tasks-list-count">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            {loading ? (
              <div className="tasks-empty-state">
                <div className="tasks-empty-icon">…</div>
                <h3>Loading your tasks</h3>
                <p>Getting everything ready.</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="tasks-empty-state">
                <div className="tasks-empty-icon">✓</div>
                <h3>Your task list is clear</h3>
                <p>Add a task above and turn your plan into progress.</p>
              </div>
            ) : (
              <div className="tasks-redesign-list">
                {tasks.map((task, index) => {
                  const isEditing = editingTaskId === task.id;

                  return (
                    <article
                      className={`task-row-card ${task.completed ? "is-complete" : ""}`}
                      key={task.id}
                    >
                      <div className="task-row-number">{String(index + 1).padStart(2, "0")}</div>

                      <button
                        type="button"
                        className={`task-row-check ${task.completed ? "checked" : ""}`}
                        onClick={() => toggleTask(task)}
                        aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="task-row-content">
                        {isEditing ? (
                          <input
                            className="task-edit-input"
                            type="text"
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") saveEdit(task);
                              if (event.key === "Escape") cancelEditing();
                            }}
                            autoFocus
                            maxLength={200}
                            aria-label="Edit task title"
                          />
                        ) : (
                          <h3>{task.title}</h3>
                        )}
                        <span>{task.completed ? "Completed" : "In progress"}</span>
                      </div>

                      <div className="task-row-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="task-action-button primary"
                              onClick={() => saveEdit(task)}
                              disabled={saving || !editingTitle.trim()}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="task-action-button"
                              onClick={cancelEditing}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="task-action-button"
                              onClick={() => startEditing(task)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="task-action-button delete"
                              onClick={() => deleteTask(task)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Tasks;
