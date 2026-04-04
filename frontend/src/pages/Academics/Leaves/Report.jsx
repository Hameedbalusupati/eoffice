import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function LeaveReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH LEAVES (FIXED)
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/leaves/user/${user.id}`
        );

        if (!ignore) {
          setData(res.data);
          setFilteredData(res.data);
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
        item.reason.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  return (
    <div style={styles.container}>
      <h2>📄 Leave Report</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by reason or status..."
        value={search}
        onChange={handleSearch}
        style={styles.search}
      />

      {/* 📋 TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No leave records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>
                <td>{item.reason}</td>

                <td>
                  <StatusIcon
                    status={item.status === "approved"}
                  />
                  <span style={{ marginLeft: "8px" }}>
                    {item.status}
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