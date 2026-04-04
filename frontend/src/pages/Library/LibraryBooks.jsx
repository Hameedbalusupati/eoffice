import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryBooks() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
  // 🔍 FILTER LOGIC
  // =========================
  const filteredData = useMemo(() => {
    return data.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "" ||
        book.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [data, search, categoryFilter]);

  // =========================
  // 📥 ISSUE BOOK
  // =========================
  const handleIssue = async (bookId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/library/issue/${bookId}`
      );

      setData((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, available: false } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔄 RETURN BOOK
  // =========================
  const handleReturn = async (bookId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/library/return/${bookId}`
      );

      setData((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, available: true } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Library Books</h2>

      {/* ================= FILTERS ================= */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="Database">Database</option>
          <option value="OS">OS</option>
          <option value="AI">AI</option>
          <option value="Networks">Networks</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No books found
              </td>
            </tr>
          ) : (
            filteredData.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>

                <td>
                  <StatusIcon status={book.available} />
                  <span style={{ marginLeft: "6px" }}>
                    {book.available ? "Available" : "Issued"}
                  </span>
                </td>

                <td>
                  {book.available ? (
                    <button
                      style={styles.issueBtn}
                      onClick={() => handleIssue(book.id)}
                    >
                      Issue
                    </button>
                  ) : (
                    <button
                      style={styles.returnBtn}
                      onClick={() => handleReturn(book.id)}
                    >
                      Return
                    </button>
                  )}
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

  issueBtn: {
    padding: "6px 10px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  returnBtn: {
    padding: "6px 10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};