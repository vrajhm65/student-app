import { useEffect, useState } from "react";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        console.log("tasks recived from backend", data);
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);
  return (
    <div className="simple-page">
      <p className="section-label">TASKS</p>
      <h1>All Tasks</h1>
      <p>Manage everything you need to accomplish.</p>
        <form
    className="add-task"
    onSubmit={async (event) => {
        event.preventDefault();

        const input = event.target.elements.taskInput;
        const title = input.value.trim();

        if (!title) return;

        const response = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: false
            })
        });

        const result = await response.json();

        setTasks((previousTasks) => [
            ...previousTasks,
            result.task
        ]);

        input.value = "";
    }}
>
    <input
        type="text"
        name="taskInput"
        placeholder="Enter a new task"
    />

    <button type="submit">
        Add Task
    </button>
</form>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <div className="task-info">
    <input
        type="checkbox"
        checked={task.completed}
        onChange={async (event) => {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: event.target.checked
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error("Update failed:", result);
                return;
            }

            setTasks((previousTasks) =>
                previousTasks.map((currentTask) =>
                    currentTask.id === task.id
                        ? result.task
                        : currentTask
                )
            );
        }}
    />

    <h4>{task.title}</h4>

    
</div>
<div className="task-actions">

    {/* EDIT */}
    <button
        type="button"
        onClick={async () => {
            const newTitle = prompt("Edit task:", task.title);

            if (!newTitle || !newTitle.trim()) return;

            const response = await fetch(
                `http://localhost:5000/api/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: newTitle.trim()
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error("Update failed:", result);
                return;
            }

            setTasks((previousTasks) =>
                previousTasks.map((currentTask) =>
                    currentTask.id === task.id
                        ? result.task
                        : currentTask
                )
            );
        }}
    >
        Edit
    </button>

    {/* DELETE */}
    <button
        type="button"
        onClick={async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/tasks/${task.id}`,
                    {
                        method: "DELETE"
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error("Delete failed:", result);
                    return;
                }

                console.log("Delete successful:", result);

                setTasks((previousTasks) =>
                    previousTasks.filter(
                        (currentTask) => currentTask.id !== task.id
                    )
                );
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }}
    >
        Delete
    </button>

</div>
        ))}
      </div>
    </div>
  );
}
export default Tasks;