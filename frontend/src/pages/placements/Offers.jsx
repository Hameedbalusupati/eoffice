import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function Offers() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // 📄 FETCH OFFERS
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/placements/offers"
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
  // 🔍 FILTER
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) =>
      item.student_name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div style={styles.container}>
      <h2>🎁 Placement Offers</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search student or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Role</th>
            <th>Package (LPA)</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No offers found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.student_name}</td>
                <td>{item.company}</td>
                <td>{item.role}</td>
                <td>{item.package}</td>

                <td>
                  <StatusIcon status={item.accepted} />
                  <span style={{ marginLeft: "6px" }}>
                    {item.accepted ? "Accepted" : "Pending"}
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
};