import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🌐 PAGES
import Dashboard from "./pages/Dashboard";

// Academics
import Assign from "./pages/Academics/Assignments/Assign";
import Manage from "./pages/Academics/Assignments/Manage";
import Report from "./pages/Academics/Assignments/Report";

// Placements
import StudentPerformance from "./pages/placements/StudentPerformance";

// 🔐 SAFE USER FUNCTION
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// 🔐 PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const user = getUser();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* HOME (LOGIN PAGE ALWAYS) */}
        <Route path="/" element={<Dashboard />} />

        {/* ACADEMICS */}
        <Route
          path="/academics/assign"
          element={
            <ProtectedRoute>
              <Assign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/academics/manage"
          element={
            <ProtectedRoute>
              <Manage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/academics/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* PLACEMENTS */}
        <Route
          path="/placements/student-performance"
          element={
            <ProtectedRoute>
              <StudentPerformance />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;