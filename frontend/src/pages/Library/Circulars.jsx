import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function LibraryCirculars() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // =========================
  // 📄 FETCH CIRCULARS
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/circulars"
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
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // =========================
  // 👁️ VIEW + MARK READ
  // =========================
  const handleView = async (item) => {
    setSelected(item);

    try {
      await axios.put(
        `http://127.0.0.1:8000/library/circular/read/${item.id}`
      );

      setData((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, read: true } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📢 Library Circulars</h2>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="Search circular..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      <div style={styles.layout}>
        {/* ================= LIST ================= */}
        <div style={styles.list}>
          {filteredData.length === 0 ? (
            <p>No circulars found</p>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  backgroundColor: item.read ? "#fff" : "#e0f2fe",
                }}
                onClick={() => handleView(item)}
              >
                <h4>{item.title}</h4>
                <p style={styles.preview}>
                  {item.message.slice(0, 40)}...
                </p>

                <div style={styles.meta}>
                  <span>{item.date}</span>
                  <StatusIcon status={item.read} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div style={styles.details}>
          {selected ? (
            <>
              <h3>{selected.title}</h3>
              <p><b>Date:</b> {selected.date}</p>

              <div style={styles.messageBox}>
                {selected.message}
              </div>
            </>
          ) : (
            <p>Select a circular to view</p>
          )}
        </div>
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
    padding: "8px",
    width: "300px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  layout: {
    display: "flex",
    gap: "20px",
  },

  list: {
    width: "35%",
    borderRight: "1px solid #ccc",
    paddingRight: "10px",
  },

  item: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },

  preview: {
    fontSize: "12px",
    color: "#555",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "5px",
  },

  details: {
    flex: 1,
    padding: "10px",
  },

  messageBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
};