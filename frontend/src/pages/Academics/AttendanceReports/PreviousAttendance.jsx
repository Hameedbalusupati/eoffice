import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../../components/StatusIcon";

export default function PreviousAttendance() {
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

        // 👉 Only attendance_reports
        const attendanceData = res.data.filter(
          (item) => item.activity_name === "attendance_reports"
        );

        setData(attendanceData);
        setFilteredData(attendanceData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user?.id]);

  // =========================
  // 🔍 SEARCH FILTER
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
      <h2>📚 Previous Attendance Reports</h2>

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
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No attendance records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>
                <td style={styles.desc}>{item.description}</td>

                <td>
                  <StatusIcon status={item.status === "completed"} />
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