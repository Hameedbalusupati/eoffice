import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../../components/StatusIcon";

export default function CounselingReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/faculty/${user?.id}`
        );

        const counselingData = res.data.filter(
          (item) => item.activity_name === "counseling"
        );

        // 🔥 Extract student info from description
        const processed = counselingData.map((item) => {
          const studentMatch = item.description.match(/Student:\s*(.*)/i);

          return {
            ...item,
            student: studentMatch ? studentMatch[1] : item.subject,
            status: true, // always completed
          };
        });

        setData(processed);
        setFilteredData(processed);
        setTotal(processed.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user?.id]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = data.filter(
      (item) =>
        item.student.toLowerCase().includes(value.toLowerCase()) ||
        item.class_name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <h2>📊 Counseling Report</h2>

      {/* 📈 SUMMARY */}
      <div style={styles.summary}>
        <h3>Total Sessions: {total}</h3>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by student or class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.student}</td>
                <td>{item.class_name}</td>
                <td style={styles.desc}>{item.description}</td>

                <td>
                  <StatusIcon status={true} />
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
  container: {
    padding: "20px",
  },

  summary: {
    marginBottom: "15px",
    fontWeight: "bold",
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
    maxWidth: "300px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};