import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({ email: "", password: "" });
  const [student, setStudent] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleFacultyChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // =========================
  // SAFE LOGIN (NO API)
  // =========================
  const login = (credentials, role) => {
    if (!credentials.email || !credentials.password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    // 👉 FAKE LOGIN (to avoid crash)
    const user = {
      email: credentials.email,
      role,
      name: "Demo User",
    };

    localStorage.setItem("user", JSON.stringify(user));

    setTimeout(() => {
      if (role === "faculty") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 500);
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Login Page</h1>

      {/* FACULTY */}
      <div>
        <h2>Faculty</h2>
        <input
          name="email"
          placeholder="Email"
          value={faculty.email}
          onChange={handleFacultyChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={faculty.password}
          onChange={handleFacultyChange}
        />
        <button onClick={() => login(faculty, "faculty")}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>

      {/* STUDENT */}
      <div>
        <h2>Student</h2>
        <input
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleStudentChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={student.password}
          onChange={handleStudentChange}
        />
        <button onClick={() => login(student, "student")}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}