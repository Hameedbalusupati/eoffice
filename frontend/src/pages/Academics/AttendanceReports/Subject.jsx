import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../../components/StatusIcon";

export default function SubjectAttendance() {
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

        // 🔥 GROUP BY SUBJECT
        const subjectMap = {};

        attendanceData.forEach((item) => {
          let present = 0;
          let absent = 0;

          const presentMatch = item.description.match(/Present:\s*(\d+)/i);
          const absentMatch = item.description.match(/Absent:\s*(\d+)/i);

          if (presentMatch) present = parseInt(presentMatch[1]);
          if (absentMatch) absent = parseInt(absentMatch[1]);

          if (!subjectMap[item.subject]) {
            subjectMap[item.subject] = {
              subject: item.subject,
              totalPresent: 0,
              totalAbsent: 0,
            };
          }

          subjectMap[item.subject].totalPresent += present;
          subjectMap[item.subject].totalAbsent += absent;
        });

        // 🔥 CALCULATE PERCENTAGE
        const result = Object.values(subjectMap).map((item) => {
          const total = item.totalPresent + item.totalAbsent;
          const percentage =
            total > 0 ? (item.totalPresent / total) * 100 : 0;

          return {
            ...item,
            percentage: percentage.toFixed(2),
            status: percentage >= 75,
          };
        });

        setData(result);
        setFilteredData(result);
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

    const filtered = data.filter((item) =>
      item.subject.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <h2>📘 Subject-wise Attendance</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search subject..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Total Present</th>
            <th>Total Absent</th>
            <th>Attendance %</th>
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
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.subject}</td>
                <td>{item.totalPresent}</td>
                <td>{item.totalAbsent}</td>
                <td>{item.percentage}%</td>

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