import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function JournalReports() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // =========================
  // 📄 FETCH JOURNALS
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/journals"
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
    return data.filter((journal) => {
      const matchesSearch =
        journal.title.toLowerCase().includes(search.toLowerCase()) ||
        journal.publisher.toLowerCase().includes(search.toLowerCase());

      const matchesYear =
        yearFilter === "" || journal.year.toString() === yearFilter;

      return matchesSearch && matchesYear;
    });
  }, [data, search, yearFilter]);

  return (
    <div style={styles.container}>
      <h2>📚 Journal Reports</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or publisher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Filter by year..."
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Publisher</th>
            <th>Year</th>
            <th>Volume</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No journals found
              </td>
            </tr>
          ) : (
            filteredData.map((journal) => (
              <tr key={journal.id}>
                <td>{journal.title}</td>
                <td>{journal.publisher}</td>
                <td>{journal.year}</td>
                <td>{journal.volume}</td>

                <td>
                  <StatusIcon status={journal.available} />
                  <span style={{ marginLeft: "6px" }}>
                    {journal.available ? "Available" : "Issued"}
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