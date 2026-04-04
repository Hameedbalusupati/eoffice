import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  // 👨‍🏫 FACULTY LOGIN
  const [faculty, setFaculty] = useState({
    email: "",
    password: "",
  });

  // 🎓 STUDENT LOGIN
  const [student, setStudent] = useState({
    email: "",
    password: "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleFacultyChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // =========================
  // LOGIN FUNCTIONS
  // =========================
  const handleFacultyLogin = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email: faculty.email,   // ✅ FIXED
          password: faculty.password,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ FIXED

      navigate("/academics/manage"); // ✅ VALID ROUTE
    } catch (error) {
      console.error("Faculty login error:", error);
      alert("Faculty Login Failed");
    }
  };

  const handleStudentLogin = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email: student.email,   // ✅ FIXED
          password: student.password,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // or create student dashboard later
    } catch (error) {
      console.error("Student login error:", error);
      alert("Student Login Failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PACE Institute Dashboard</h1>

      <div style={styles.cards}>
        {/* FACULTY */}
        <div style={styles.card}>
          <h2>👨‍🏫 Faculty Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={faculty.email}
            onChange={handleFacultyChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={faculty.password}
            onChange={handleFacultyChange}
            style={styles.input}
          />

          <button style={styles.button} onClick={handleFacultyLogin}>
            LOGIN
          </button>
        </div>

        {/* STUDENT */}
        <div style={styles.card}>
          <h2>🎓 Student Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleStudentChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={student.password}
            onChange={handleStudentChange}
            style={styles.input}
          />

          <button style={styles.button} onClick={handleStudentLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f3f4f6",
    height: "100vh",
  },

  title: {
    marginBottom: "30px",
    color: "#1e3a8a",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  },

  card: {
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};