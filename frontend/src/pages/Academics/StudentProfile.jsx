import { useState } from "react";
import axios from "axios";

export default function StudentProfile() {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  // =========================
  // 🔍 SEARCH STUDENT
  // =========================
  const handleSearch = async () => {
    if (!rollNo) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/student/${rollNo}`
      );

      setStudent(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setStudent(null);
      setMessage("❌ Student not found");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👨‍🎓 Student Profile</h2>

      {/* ================= SEARCH ================= */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= PROFILE CARD ================= */}
      {student && (
        <div style={styles.card}>
          <h3>{student.name}</h3>

          <p><b>Roll No:</b> {student.roll_no}</p>
          <p><b>Class:</b> {student.class_name}</p>
          <p><b>Branch:</b> {student.branch}</p>
          <p><b>Email:</b> {student.email}</p>
          <p><b>Phone:</b> {student.phone}</p>
          <p><b>Address:</b> {student.address}</p>
          <p><b>Year:</b> {student.year}</p>
        </div>
      )}
    </div>
  );
}


// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "250px",
  },

  button: {
    padding: "10px 15px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  card: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    border: "1px solid #ddd",
  },

  message: {
    color: "red",
    marginBottom: "10px",
  },
};