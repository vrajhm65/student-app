import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Daily() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newPlan, setNewPlan] = useState({
    time: "",
    title: "",
  });

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/plans";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchPlans = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching daily plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const addPlan = async (event) => {
    event.preventDefault();

    if (!newPlan.time || !newPlan.title) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newPlan),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to add plan:", data);
        return;
      }

      setPlans((previous) => [...previous, data.plan]);

      setNewPlan({
        time: "",
        title: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  const togglePlan = async (plan) => {
    try {
      const response = await fetch(`${API_URL}/${plan.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          completed: !plan.completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update plan:", data);
        return;
      }

      setPlans((previous) =>
        previous.map((item) =>
          item.id === plan.id ? data.plan : item
        )
      );
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to delete plan:", data);
        return;
      }

      setPlans((previous) =>
        previous.filter((plan) => plan.id !== id)
      );
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const completedPlans = plans.filter(
    (plan) => plan.completed
  ).length;

  const progress =
    plans.length > 0
      ? Math.round((completedPlans / plans.length) * 100)
      : 0;

  const today = new Date();

  const dateText = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="daily-page">

          <div className="daily-page-header">
            <div>
              <p className="section-label">DAILY</p>

              <h1>Plan your day.</h1>

              <p className="daily-date">
                {dateText}
              </p>
            </div>

            <button
              className="add-plan-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Plan"}
            </button>
          </div>

          <div className="daily-progress-card">
            <div className="progress-info">
              <div>
                <span>Today's Progress</span>
                <strong>
                  {completedPlans} / {plans.length} completed
                </strong>
              </div>

              <strong>{progress}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {showForm && (
            <form
              className="daily-form"
              onSubmit={addPlan}
            >
              <input
                type="time"
                value={newPlan.time}
                onChange={(event) =>
                  setNewPlan({
                    ...newPlan,
                    time: event.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="What do you want to do?"
                value={newPlan.title}
                onChange={(event) =>
                  setNewPlan({
                    ...newPlan,
                    title: event.target.value,
                  })
                }
                required
              />

              <button type="submit">
                Add
              </button>
            </form>
          )}

          <div className="daily-plans">

            {plans.length === 0 ? (
              <div className="daily-empty">
                <div className="empty-icon">☀</div>

                <h2>Your day is empty.</h2>

                <p>
                  Add your first plan and start organizing
                  your day.
                </p>

                <button
                  onClick={() => setShowForm(true)}
                >
                  + Create First Plan
                </button>
              </div>
            ) : (
              plans
                .slice()
                .sort((a, b) =>
                  a.time.localeCompare(b.time)
                )
                .map((plan) => (
                  <div
                    className={`daily-plan ${
                      plan.completed
                        ? "plan-completed"
                        : ""
                    }`}
                    key={plan.id}
                  >
                    <div className="daily-plan-time">
                      {plan.time}
                    </div>

                    <div className="daily-plan-main">

                      <button
                        className={`plan-check ${
                          plan.completed
                            ? "checked"
                            : ""
                        }`}
                        onClick={() =>
                          togglePlan(plan)
                        }
                      >
                        {plan.completed ? "✓" : ""}
                      </button>

                      <span>
                        {plan.title}
                      </span>
                    </div>

                    <button
                      className="plan-delete"
                      onClick={() =>
                        deletePlan(plan.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))
            )}

          </div>

        </section>
      </main>
    </div>
  );
}

export default Daily;