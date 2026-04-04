import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function AbsenteesReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

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

        const attendanceData = res.data.filter(
          (item) => item.activity_name === "attendance_reports"
        );

        // 🔥 PROCESS DATA
        const processed = attendanceData.map((item) => {
          const dateMatch = item.description.match(/Date:\s*([^\n]+)/i);
          const absentMatch = item.description.match(/Absent:\s*(\d+)/i);

          const date = dateMatch ? dateMatch[1] : "N/A";
          const absent = absentMatch ? parseInt(absentMatch[1]) : 0;

          return {
            id: item.id,
            subject: item.subject,
            class_name: item.class_name,
            date,
            absent,
            status: absent === 0, // ✔️ if no absentees
          };
        });

        setData(processed);
        setFilteredData(processed);
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
        item.subject.toLowerCase().includes(value.toLowerCase()) ||
        item.class_name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <h2>🚫 Absentees Report</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by Subject or Class..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class</th>
            <th>Date</th>
            <th>Absent Count</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No data found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>
                <td>{item.date}</td>
                <td>{item.absent}</td>

                <td>
                  <StatusIcon status={item.status} />
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

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};