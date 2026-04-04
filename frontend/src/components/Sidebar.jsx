import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Academics", path: "/academics" },
    { name: "Correspondence", path: "/correspondence" },
    { name: "Employee", path: "/employee" },
    { name: "Examinations", path: "/examinations" },
    { name: "Library", path: "/library" },
    { name: "Placements", path: "/placements" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">📂 Modules</h2>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="sidebar-item"
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}