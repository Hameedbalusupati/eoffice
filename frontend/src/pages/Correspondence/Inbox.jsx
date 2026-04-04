import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function Inbox() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH MESSAGES
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/correspondence/inbox/${user.id}`
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
  }, [user?.id]);

  // =========================
  // 👁️ VIEW MESSAGE
  // =========================
  const handleView = async (msg) => {
    setSelected(msg);

    // mark as read
    try {
      await axios.put(
        `http://127.0.0.1:8000/correspondence/inbox/read/${msg.id}`
      );

      // update UI
      setData((prev) =>
        prev.map((item) =>
          item.id === msg.id ? { ...item, read: true } : item
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📥 Inbox</h2>

      <div style={styles.layout}>
        {/* ================= LIST ================= */}
        <div style={styles.list}>
          {data.length === 0 ? (
            <p>No messages</p>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  backgroundColor: item.read ? "#fff" : "#e0f2fe",
                }}
                onClick={() => handleView(item)}
              >
                <h4>{item.title || item.type}</h4>
                <p style={styles.preview}>
                  {item.message?.slice(0, 40)}...
                </p>

                <div style={styles.meta}>
                  <span>{item.type}</span>
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
              <h3>{selected.title || selected.type}</h3>

              <p><b>Type:</b> {selected.type}</p>
              <p><b>From:</b> {selected.sender || "System"}</p>

              <div style={styles.messageBox}>
                {selected.message}
              </div>
            </>
          ) : (
            <p>Select a message to view</p>
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