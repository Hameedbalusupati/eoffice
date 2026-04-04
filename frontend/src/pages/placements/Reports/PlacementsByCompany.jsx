import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function PlacementsByCompanies() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openCompany, setOpenCompany] = useState(null);

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/placements/all"
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
  // 🔍 GROUP + FILTER
  // =========================
  const groupedData = useMemo(() => {
    const filtered = data.filter((item) =>
      item.company.toLowerCase().includes(search.toLowerCase())
    );

    const groups = {};

    filtered.forEach((item) => {
      if (!groups[item.company]) {
        groups[item.company] = [];
      }
      groups[item.company].push(item);
    });

    return groups;
  }, [data, search]);

  // =========================
  // 🔄 TOGGLE COMPANY
  // =========================
  const toggleCompany = (company) => {
    setOpenCompany(openCompany === company ? null : company);
  };

  return (
    <div style={styles.container}>
      <h2>🏢 Placements by Companies</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= GROUP VIEW ================= */}
      {Object.keys(groupedData).length === 0 ? (
        <p>No data found</p>
      ) : (
        Object.entries(groupedData).map(([company, students]) => (
          <div key={company} style={styles.card}>
            {/* HEADER */}
            <div
              style={styles.header}
              onClick={() => toggleCompany(company)}
            >
              <h3>{company}</h3>
              <span>{students.length} students</span>
            </div>

            {/* DETAILS */}
            {openCompany === company && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Year</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((item) => (
                    <tr key={item.id}>
                      <td>{item.student_name}</td>
                      <td>{item.role}</td>
                      <td>{item.package} LPA</td>
                      <td>{item.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
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

  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};