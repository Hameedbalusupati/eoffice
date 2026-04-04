import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function InternshipCompanies() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH COMPANIES
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/placements/internship/companies"
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
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 🚀 APPLY
  // =========================
  const handleApply = async (companyId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/placements/internship/apply`,
        {
          user_id: user?.id,
          company_id: companyId,
        }
      );

      alert("Applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Error applying");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏢 Internship Companies</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= CARDS ================= */}
      <div style={styles.grid}>
        {filteredData.length === 0 ? (
          <p>No companies found</p>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3>{item.company}</h3>

              <p><b>Role:</b> {item.role}</p>
              <p><b>Location:</b> {item.location}</p>
              <p><b>Stipend:</b> ₹{item.stipend}</p>

              <div style={styles.status}>
                <StatusIcon status={item.open} />
                <span>
                  {item.open ? "Open" : "Closed"}
                </span>
              </div>

              <button
                style={styles.button}
                disabled={!item.open}
                onClick={() => handleApply(item.id)}
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: { padding: "20px" },

  input: {
    padding: "10px",
    width: "300px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "10px",
    fontWeight: "bold",
  },

  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};