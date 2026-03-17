import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex">
      <Sidebar user={user} />

      <div className="flex-1">
        <Navbar user={user} onLogout={logout} />

        <div className="p-6">
          <h2 className="text-2xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="mt-2">
            Role: <b>{user?.role}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;