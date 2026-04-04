import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function ComplaintSuggestion() {
  const [form, setForm] = useState({
    type: "complaint",
    title: "",
    message: "",
  });

  const [data, setData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // 📄 FETCH HISTORY
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/correspondence/complaints/${user.id}`
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
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Type: ${form.type}
Title: ${form.title}

Message:
${form.message}
      `;

      await axios.post(
        "http://127.0.0.1:8000/correspondence/complaint",
        {
          user_id: user?.id,
          type: form.type,
          title: form.title,
          message: form.message,
          description: description,
        }
      );

      setStatusMsg("📩 Submitted successfully!");

      setForm({
        type: "complaint",
        title: "",
        message: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/correspondence/complaints/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to submit");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📩 Complaint / Suggestion</h2>

      {statusMsg && <p style={styles.message}>{statusMsg}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="complaint">Complaint</option>
          <option value="suggestion">Suggestion</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="message"
          placeholder="Enter your message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.type}</td>
                <td>{item.title}</td>

                <td style={styles.desc}>
                  {item.message}
                </td>

                <td>
                  <StatusIcon status={item.status === "resolved"} />
                  <span style={{ marginLeft: "6px" }}>
                    {item.status}
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

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "100px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "300px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};