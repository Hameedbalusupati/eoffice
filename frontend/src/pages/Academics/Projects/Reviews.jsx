import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function ProjectsReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH DATA (FIXED)
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/projects/${user.id}`
        );

        if (!ignore) {
          setData(res.data);
          setFilteredData(res.data);

          // 🔥 SUMMARY
          const total = res.data.length;
          const completed = res.data.filter(
            (item) => item.status === "completed"
          ).length;
          const ongoing = total - completed;

          setSummary({ total, completed, ongoing });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        item.subject.toLowerCase().includes(value) ||
        item.class_name.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <h2>📊 Projects Report</h2>

      {/* 📈 SUMMARY */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Total</h3>
          <p>{summary.total}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#22c55e" }}>
          <h3>Completed</h3>
          <p>{summary.completed}</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#f59e0b" }}>
          <h3>Ongoing</h3>
          <p>{summary.ongoing}</p>
        </div>
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search project..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No projects found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>

                <td style={styles.desc}>
                  {item.description}
                </td>

                <td>
                  <StatusIcon
                    status={item.status === "completed"}
                  />
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

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    flex: 1,
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
  },

  search: {
    padding: "10px",
    width: "300px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "400px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};