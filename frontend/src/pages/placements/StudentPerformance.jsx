import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function StudentPerformance() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/placements/student-performance"
        );

        if (!ignore) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  // =========================
  // 🔍 FILTER + SORT
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      temp = temp.filter((item) =>
        item.student_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort by score descending
    return [...temp].sort((a, b) => b.score - a.score);
  }, [data, search]);

  // =========================
  // 🏆 RANK
  // =========================
  const getRank = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div style={styles.container}>
      <h2>📊 Student Performance</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>Skills</th>
            <th>Score</th>
            <th>Company</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr
                key={item.id}
                style={index < 3 ? styles.top : {}}
              >
                <td>{getRank(index)}</td>
                <td>{item.student_name}</td>
                <td>{item.skills}</td>
                <td>{item.score}</td>
                <td>{item.company || "-"}</td>

                <td>
                  <StatusIcon status={item.placed} />
                  <span style={{ marginLeft: "6px" }}>
                    {item.placed ? "Placed" : "Not Placed"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  input: {
    padding: "8px",
    width: "300px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  top: {
    backgroundColor: "#fef9c3",
    fontWeight: "bold",
  },
};