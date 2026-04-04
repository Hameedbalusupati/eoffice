import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function OPAC() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // =========================
  // 📄 FETCH BOOKS
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/books"
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
  // 🔍 GLOBAL SEARCH
  // =========================
  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div style={styles.container}>
      <h2>🔍 Library OPAC</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search books by title, author, category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* ================= RESULTS ================= */}
      <div style={styles.grid}>
        {filteredData.length === 0 ? (
          <p>No books found</p>
        ) : (
          filteredData.map((book) => (
            <div key={book.id} style={styles.card}>
              <h3>{book.title}</h3>

              <p><b>Author:</b> {book.author}</p>
              <p><b>Category:</b> {book.category}</p>

              {/* OPTIONAL LOCATION */}
              {book.location && (
                <p><b>Location:</b> {book.location}</p>
              )}

              <div style={styles.status}>
                <StatusIcon status={book.available} />
                <span>
                  {book.available ? "Available" : "Issued"}
                </span>
              </div>
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
    padding: "12px",
    width: "350px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
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
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
  },
};