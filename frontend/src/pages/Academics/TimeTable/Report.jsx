import { useEffect, useState } from "react";
import axios from "axios";

export default function DayTimeTable() {
  const [className, setClassName] = useState("");
  const [day, setDay] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH TIMETABLE
  // =========================
  useEffect(() => {
    if (!className || !day) return;

    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/academics/day-timetable",
          {
            params: {
              faculty_id: user?.id,
              class_name: className,
              day: day,
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
  }, [className, day, user?.id]);

  // =========================
  // 🔘 MANUAL FETCH
  // =========================
  const handleFetch = async () => {
    if (!className || !day) return;

    setLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/academics/day-timetable",
        {
          params: {
            faculty_id: user?.id,
            class_name: className,
            day: day,
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
      <h2>📅 Day Time Table</h2>

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
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>

        <button onClick={handleFetch} style={styles.button}>
          Show
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No timetable available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Period</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Room</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.period}</td>
                <td>{item.time}</td>
                <td>{item.subject}</td>
                <td>{item.faculty}</td>
                <td>{item.room}</td>
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
  container: {
    padding: "20px",
  },

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
    backgroundColor: "#7c3aed",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};