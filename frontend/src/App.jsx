import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";

// PAGES
import Dashboard from "./pages/Dashboard";

// Academics
import Assign from "./pages/Academics/Assignments/Assign";
import Manage from "./pages/Academics/Assignments/Manage";
import Report from "./pages/Academics/Assignments/Report";

// Placements
import StudentPerformance from "./pages/placements/StudentPerformance";

// =========================
// 🔐 SAFE USER FUNCTION
// =========================
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// =========================
// 🔐 PROTECTED ROUTE
// =========================
const ProtectedRoute = ({ children }) => {
  const user = getUser();

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// =========================
// 🚀 APP
// =========================
function App() {
  const location = useLocation();
  const user = getUser();

  // Hide navbar only on login page
  const hideNavbar = location.pathname === "/" && !user;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= LOGIN PAGE ================= */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                Login Page (Add your login UI here)
              </h2>
            )
          }
        />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ACADEMICS ================= */}
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

        {/* ================= PLACEMENTS ================= */}
        <Route
          path="/placements/student-performance"
          element={
            <ProtectedRoute>
              <StudentPerformance />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;