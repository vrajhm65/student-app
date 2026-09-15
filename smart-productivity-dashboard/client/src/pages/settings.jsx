import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Settings() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

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
            <p className="section-label">SETTINGS</p>
            <h1>Make SmartFlow yours.</h1>
            <p>
              Manage your preferences and account.
            </p>
          </div>

          <div className="settings-card">
            <div className="settings-row">
              <div>
                <h3>Appearance</h3>
                <p>Use the dark SmartFlow interface.</p>
              </div>

              <button
                className={`toggle-button ${
                  darkMode ? "active" : ""
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Dark" : "Light"}
              </button>
            </div>

            <div className="settings-row">
              <div>
                <h3>Account</h3>
                <p>Your SmartFlow account is protected by authentication.</p>
              </div>

              <span className="settings-status">
                Protected
              </span>
            </div>

            <div className="settings-row">
              <div>
                <h3>Session</h3>
                <p>Sign out from this device.</p>
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