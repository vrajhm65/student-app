import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
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