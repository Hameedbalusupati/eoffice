import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function PlacementsLeavesHistory() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH LEAVES
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/placements/leaves/${user.id}`
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
  }, [user?.id]);

  // =========================
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      temp = temp.filter((item) =>
        item.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      temp = temp.filter((item) => item.status === statusFilter);
    }

    return temp;
  }, [data, search, statusFilter]);

  return (
    <div style={styles.container}>
      <h2>📄 Placement Leave History</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
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
                  <StatusIcon status={item.status === "approved"} />
                  <span style={{ marginLeft: "6px" }}>
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
  container: { padding: "20px" },

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    padding: "8px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  select: {
    padding: "8px",
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