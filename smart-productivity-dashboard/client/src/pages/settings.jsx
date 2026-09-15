import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="settings-page">
          <div className="settings-header">
            <p className="section-label">HELP & TIPS</p>
            <h1>Make the most of SmartFlow.</h1>
            <p>
              Simple ways to stay organized and productive.
            </p>
          </div>

          <div className="settings-card">

            <div className="settings-row">
              <div>
                <h3>Tasks</h3>
                <p>
                  Add tasks from the Menu and mark them complete when finished.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <h3>Daily Planner</h3>
                <p>
                  Use Daily to plan your activities and track what you complete.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <h3>Focus Timer</h3>
                <p>
                  Start the timer when you want to focus and build productive
                  sessions throughout your day.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <h3>Calendar</h3>
                <p>
                  Use Calendar to get a simple overview of your month and tasks.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <h3>Your Data</h3>
                <p>
                  Your tasks, plans and focus data are connected to your account.
                </p>
              </div>

              <span className="settings-status">
                Protected
              </span>
            </div>

            <div className="settings-row">
              <div>
                <h3>Sign Out</h3>
                <p>
                  Log out of your SmartFlow account on this device.
                </p>
              </div>

              <button
                className="danger-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;