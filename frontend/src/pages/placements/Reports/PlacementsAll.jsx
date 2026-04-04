import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function PlacementsAll() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

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
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.student_name.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase());

      const matchesCompany =
        companyFilter === "" || item.company === companyFilter;

      return matchesSearch && matchesCompany;
    });
  }, [data, search, companyFilter]);

  // =========================
  // 📊 UNIQUE COMPANIES
  // =========================
  const companies = [...new Set(data.map((d) => d.company))];

  return (
    <div style={styles.container}>
      <h2>🎯 All Placements</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search student or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Companies</option>
          {companies.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Company</th>
            <th>Role</th>
            <th>Package (LPA)</th>
            <th>Year</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No placement records found
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.student_name}</td>
                <td>{item.company}</td>
                <td>{item.role}</td>
                <td>{item.package}</td>
                <td>{item.year}</td>
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