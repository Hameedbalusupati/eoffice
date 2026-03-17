import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      
      {/* Logo / Title */}
      <h1 className="text-xl font-bold">eSalary System</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user?.name} ({user?.role})
        </span>

        <button
          onClick={onLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;