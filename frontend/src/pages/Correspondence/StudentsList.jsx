import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function StudentList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // 📄 FETCH STUDENTS
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/academics/students"
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
  // 🔍 SEARCH FILTER
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(search.toLowerCase()) ||
      student.class_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div style={styles.container}>
      <h2>👨‍🎓 Student List</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search by name / roll / class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Branch</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.noData}>
                No students found
              </td>
            </tr>
          ) : (
            filteredData.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.roll_no}</td>
                <td>{student.class_name}</td>
                <td>{student.branch}</td>
                <td>{student.email}</td>

                <td>
                  <StatusIcon status={student.active} />
                  <span style={{ marginLeft: "6px" }}>
                    {student.active ? "Active" : "Inactive"}
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
    width: "320px",
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
};