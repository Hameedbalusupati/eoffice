import { useEffect, useState } from "react";
import axios from "axios";

export default function PerformancePresent() {
  const [className, setClassName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH DATA (FIXED ✅)
  // =========================
  useEffect(() => {
    if (!className) return;

    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/academics/performance-present",
          {
            params: {
              faculty_id: user?.id,
              class_name: className,
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
  }, [className, user?.id]); // ✅ FIXED dependencies

  // =========================
  // 🔘 MANUAL FETCH BUTTON
  // =========================
  const handleFetch = async () => {
    if (!className) return;

    setLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/academics/performance-present",
        {
          params: {
            faculty_id: user?.id,
            class_name: className,
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
      <h2>📊 Performance (Present)</h2>

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

        <button onClick={handleFetch} style={styles.button}>
          Show
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data available</p>
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
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};