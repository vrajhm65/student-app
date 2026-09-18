import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getUserData() {
  try {
    const savedUser = localStorage.getItem("smartflow_user");

    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        name: payload.name || payload.username || "",
        email: payload.email || "",
      };
    } catch {
      // Token may not contain readable user information.
    }
  }

  return {
    name: "",
    email: "",
  };
}

function getInitials(name) {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

function Header() {
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState(getGreeting());
  const [user, setUser] = useState(getUserData());

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);

  const headerRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadHeaderData = async () => {
      if (!token) return;

      try {
        const [tasksResponse, plansResponse] = await Promise.all([
          fetch("http://localhost:5000/api/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/plans", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (tasksResponse.ok) {
          const taskData = await tasksResponse.json();
          setTasks(Array.isArray(taskData) ? taskData : []);
        }

        if (plansResponse.ok) {
          const planData = await plansResponse.json();
          setPlans(Array.isArray(planData) ? planData : []);
        }
      } catch (error) {
        console.error("Header data error:", error);
      }
    };

    loadHeaderData();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserData());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayPlans = useMemo(() => {
    return plans.filter((plan) => {
      const planDate =
        plan.date ||
        plan.planDate ||
        plan.createdAt?.split("T")[0];

      return planDate === today;
    });
  }, [plans, today]);

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const notificationCount =
    pendingTasks.length + todayPlans.length;

  const displayName = user.name || "there";
  const initials = getInitials(user.name);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartflow_user");

    navigate("/login");
  };

  const toggleNotifications = () => {
    setNotificationsOpen((previous) => !previous);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((previous) => !previous);
    setNotificationsOpen(false);
  };

  return (
    <header className="header" ref={headerRef}>
      <div className="header-copy">
        <p className="header-label">YOUR PRODUCTIVITY</p>

        <h2>
          {greeting}, {displayName}
        </h2>

        <div className="header-status">
          <span className="header-status-dot" />
          <span>Focus mode ready</span>
        </div>
      </div>

      <div className="header-actions">

        {/* DATE */}
        <div className="header-date">
          {formatDate()}
        </div>

        {/* NOTIFICATIONS */}
        <div className="header-action-wrap">
          <button
            type="button"
            className={`header-action-button header-notification ${
              notificationsOpen ? "is-active" : ""
            }`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <svg
              className="header-action-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            {notificationCount > 0 && (
              <span className="notification-count">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="header-popover notification-popover">

              <div className="popover-header">
                <div>
                  <span className="popover-label">SMARTFLOW</span>
                  <h3>Notifications</h3>
                </div>

                <span className="popover-count">
                  {notificationCount}
                </span>
              </div>

              <div className="notification-list">

                {pendingTasks.length > 0 && (
                  <button
                    type="button"
                    className="notification-item"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/tasks");
                    }}
                  >
                    <span className="notification-icon task-notification">
                      ✓
                    </span>

                    <span>
                      <strong>
                        {pendingTasks.length} task
                        {pendingTasks.length !== 1 ? "s" : ""} pending
                      </strong>

                      <small>
                        You still have work waiting to be completed.
                      </small>
                    </span>
                  </button>
                )}

                {todayPlans.length > 0 && (
                  <button
                    type="button"
                    className="notification-item"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/daily");
                    }}
                  >
                    <span className="notification-icon plan-notification">
                      ◷
                    </span>

                    <span>
                      <strong>
                        {todayPlans.length} plan
                        {todayPlans.length !== 1 ? "s" : ""} today
                      </strong>

                      <small>
                        Your daily schedule has planned activity.
                      </small>
                    </span>
                  </button>
                )}

                {completedTasks.length > 0 &&
                  pendingTasks.length === 0 && (
                    <div className="notification-item notification-success">
                      <span className="notification-icon success-notification">
                        ✓
                      </span>

                      <span>
                        <strong>All tasks completed</strong>
                        <small>
                          Nice work. Your task list is clear.
                        </small>
                      </span>
                    </div>
                  )}

                {notificationCount === 0 && (
                  <div className="notification-empty">
                    <div className="notification-empty-icon">
                      ✓
                    </div>

                    <strong>You're all caught up</strong>

                    <span>
                      Nothing needs your attention right now.
                    </span>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT */}
        <div className="header-action-wrap">
          <button
            type="button"
            className={`header-action-button header-profile ${
              profileOpen ? "is-active" : ""
            }`}
            aria-label="Account"
            aria-expanded={profileOpen}
            onClick={toggleProfile}
          >
            <span className="header-profile-avatar">
              {initials}
            </span>
          </button>

          {profileOpen && (
            <div className="header-popover profile-popover">

              <div className="profile-summary">
                <div className="profile-large-avatar">
                  {initials}
                </div>

                <div className="profile-summary-text">
                  <strong>{user.name || "SmartFlow User"}</strong>

                  <span>
                    {user.email || "Account"}
                  </span>
                </div>
              </div>

              <div className="profile-divider" />

              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
              >
                <span>⚙</span>
                <span>
                  <strong>Settings</strong>
                  <small>Manage your account</small>
                </span>
              </button>

              <button
                type="button"
                className="profile-menu-item profile-logout"
                onClick={handleLogout}
              >
                <span>↪</span>
                <span>
                  <strong>Log out</strong>
                  <small>End your current session</small>
                </span>
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;