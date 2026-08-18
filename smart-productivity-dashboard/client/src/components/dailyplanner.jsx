import { useState } from "react";

function DailyPlanner() {
  const [plans, setPlans] = useState([ ]);

  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    time: "",
    title: "",
    description: "",
  });

  const addPlan = (event) => {
    event.preventDefault();

    if (!newPlan.time || !newPlan.title.trim()) {
      return;
    }

    const plan = {
      id: Date.now(),
      time: newPlan.time,
      title: newPlan.title.trim(),
      description: newPlan.description.trim(),
    };

    setPlans((previousPlans) => [
      ...previousPlans,
      plan,
    ]);

    setNewPlan({
      time: "",
      title: "",
      description: "",
    });

    setShowForm(false);
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
    <span>{plan.time}</span>

    <div>
      <h4>{plan.title}</h4>
      <p>{plan.description}</p>
    </div>

    <button
      type="button"
      onClick={() => {
        setPlans((previousPlans) =>
          previousPlans.filter(
            (currentPlan) => currentPlan.id !== plan.id
          )
        );
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