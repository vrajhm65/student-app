import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="dashboard-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Let's make today productive.</p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;