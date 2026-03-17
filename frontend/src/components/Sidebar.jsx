import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ user }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      
      <h2 className="text-lg font-bold mb-6">Menu</h2>

      <ul className="space-y-4">
        
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/salary" className="hover:text-gray-300">
            Salary
          </Link>
        </li>

        <li>
          <Link to="/reports" className="hover:text-gray-300">
            Reports
          </Link>
        </li>

        {/* Admin Only */}
        {user?.role === "admin" && (
          <>
            <li>
              <Link to="/admin" className="hover:text-gray-300">
                Admin Panel
              </Link>
            </li>

            <li>
              <Link to="/faculty" className="hover:text-gray-300">
                Manage Faculty
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;