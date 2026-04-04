import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function SubscriptionReport() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/subscriptions"
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
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "active" && item.active) ||
        (statusFilter === "expired" && !item.active);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  return (
    <div style={styles.container}>
      <h2>📚 Subscription Report</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search user..."
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
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Start Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No subscriptions found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>{item.start_date}</td>
                <td>{item.expiry_date}</td>

                <td>
                  <StatusIcon status={item.active} />
                  <span style={{ marginLeft: "6px" }}>
                    {item.active ? "Active" : "Expired"}
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