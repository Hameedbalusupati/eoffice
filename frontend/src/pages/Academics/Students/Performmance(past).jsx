import { useEffect, useState } from "react";
import axios from "axios";

export default function PerformancePast() {
  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH DATA (SAFE ✅)
  // =========================
  useEffect(() => {
    if (!className || !semester) return;

    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/academics/performance-past",
          {
            params: {
              faculty_id: user?.id,
              class_name: className,
              semester: semester,
            },
          }
        );

        if (!ignore) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      }

      if (!ignore) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [className, semester, user?.id]);

  // =========================
  // 🔘 MANUAL FETCH
  // =========================
  const handleFetch = async () => {
    if (!className || !semester) return;

    setLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/academics/performance-past",
        {
          params: {
            faculty_id: user?.id,
            class_name: className,
            semester: semester,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>📊 Performance (Past)</h2>

      {/* ================= FILTER ================= */}
      <div style={styles.filter}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Class</option>
          <option value="CSE-A">CSE-A</option>
          <option value="CSE-B">CSE-B</option>
          <option value="ECE-A">ECE-A</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Semester</option>
          <option value="1-1">1-1</option>
          <option value="1-2">1-2</option>
          <option value="2-1">2-1</option>
          <option value="2-2">2-2</option>
          <option value="3-1">3-1</option>
          <option value="3-2">3-2</option>
          <option value="4-1">4-1</option>
          <option value="4-2">4-2</option>
        </select>

        <button onClick={handleFetch} style={styles.button}>
          Show
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No past records found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Internal</th>
              <th>External</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.roll_no}</td>
                <td>{item.student_name}</td>
                <td>{item.subject}</td>
                <td>{item.internal}</td>
                <td>{item.external}</td>
                <td>{item.total}</td>
                <td>{item.grade}</td>
                <td>{item.attendance}%</td>
                <td>
                  {item.total >= 40 ? (
                    <span style={{ color: "green" }}>✔ Pass</span>
                  ) : (
                    <span style={{ color: "red" }}>❌ Fail</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  filter: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  select: {
    padding: "8px",
  },

  button: {
    padding: "8px 15px",
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};