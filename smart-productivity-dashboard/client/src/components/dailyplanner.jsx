import { useEffect, useState } from "react";

function DailyPlanner() {
  const [plans, setPlans] = useState([ ]);
  useEffect(() => {
    fetch("http://localhost:5000/api/plans")
        .then((response) => response.json())
        .then((data) => {
            console.log("Plans received from backend:", data);
            setPlans(data);
        })
        .catch((error) => {
            console.error("Error fetching plans:", error);
        });
}, []);

  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    time: "",
    title: "",
    description: "",
  });

  const addPlan = async (event) => {
    event.preventDefault();

    if (!newPlan.time || !newPlan.title.trim()) {
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/plans",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    time: newPlan.time,
                    title: newPlan.title.trim(),
                    description: newPlan.description.trim(),
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("Add plan failed:", result);
            return;
        }

        setPlans((previousPlans) => [
            ...previousPlans,
            result.plan,
        ]);

        setNewPlan({
            time: "",
            title: "",
            description: "",
        });

        setShowForm(false);

    } catch (error) {
        console.error("Error adding plan:", error);
    }
};

  return (
    <section className="daily-planner">

      <div className="section-heading">
        <div>
          <p className="section-label">DAILY</p>
          <h3>Today's Plan</h3>
        </div>

        <button
          className="view-button"
          type="button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Add"}
        </button>
      </div>

      {/* ADD PLAN FORM */}
      {showForm && (
        <form
          className="planner-form"
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
          />

          <input
            type="text"
            placeholder="Plan title"
            value={newPlan.title}
            onChange={(event) =>
              setNewPlan({
                ...newPlan,
                title: event.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={newPlan.description}
            onChange={(event) =>
              setNewPlan({
                ...newPlan,
                description: event.target.value,
              })
            }
          />

          <button type="submit">
            Add Plan
          </button>
        </form>
      )}

      {/* PLANS */}
      {plans.map((plan) => (
  <div
    className="planner-item"
    key={plan.id}
  >

<input
    type="checkbox"
    checked={plan.completed}
    onChange={async (event) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/plans/${plan.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        completed: event.target.checked,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error(
                    "Update plan failed:",
                    result
                );
                return;
            }

            setPlans((previousPlans) =>
                previousPlans.map((currentPlan) =>
                    currentPlan.id === plan.id
                        ? result.plan
                        : currentPlan
                )
            );
        } catch (error) {
            console.error(
                "Error updating plan:",
                error
            );
        }
    }}
/>

    <span>{plan.time}</span>

    <div>
      <h4>{plan.title}</h4>
      <p>{plan.description}</p>
    </div>

    <button
      type="button"
      onClick={async () => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/plans/${plan.id}`,
            {
                method: "DELETE",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("Delete plan failed:", result);
            return;
        }

        setPlans((previousPlans) =>
            previousPlans.filter(
                (currentPlan) => currentPlan.id !== plan.id
            )
        );

    } catch (error) {
        console.error("Error deleting plan:", error);
    }
}}
    >
      Delete
    </button>
  </div>
))}

    </section>
  );
}

export default DailyPlanner;