import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function BestUser() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/best-users"
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
  // 🔍 FILTER + SORT
  // =========================
  const filteredData = useMemo(() => {
    let temp = data;

    if (search) {
      temp = temp.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort descending by books count
    return [...temp].sort((a, b) => b.books_count - a.books_count);
  }, [data, search]);

  // =========================
  // 🏆 GET MEDAL
  // =========================
  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div style={styles.container}>
      <h2>🏆 Best Library Users</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Role</th>
            <th>Books Taken</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No users found
              </td>
            </tr>
          ) : (
            filteredData.map((user, index) => (
              <tr
                key={user.id}
                style={
                  index < 3
                    ? styles.topUser
                    : {}
                }
              >
                <td>{getMedal(index)}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.books_count}</td>
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
    width: "250px",
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

  topUser: {
    backgroundColor: "#fef9c3",
    fontWeight: "bold",
  },
};