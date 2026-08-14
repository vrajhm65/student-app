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
        <div className="add-task">
    <input
        type="text"
        placeholder="Enter a new task"
        id="taskInput"
    />

    <button
        onClick={async () => {
            const input = document.getElementById("taskInput");

            if (!input.value.trim()) return;

            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: input.value,
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
        Add Task
    </button>
</div>
      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <div className="task-info">
              <h4>{task.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Tasks;