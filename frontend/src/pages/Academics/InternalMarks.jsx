import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function Circulars() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    date: "",
  });

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

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
  // 📄 FETCH CIRCULARS
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/circulars/${user.id}`
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
  // 🚀 ADD CIRCULAR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Date: ${form.date}

Message:
${form.message}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "circulars",
        subject: form.title,
        class_name: "All",
        description: description,
        status: "completed",
      });

      setMessage("📢 Circular added successfully!");

      setForm({
        title: "",
        message: "",
        date: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/circulars/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add circular");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📢 Circulars</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Circular Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="message"
          placeholder="Circular Message"
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Circular
        </button>
      </form>

      {/* ================= LIST ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.noData}>
                No circulars found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>

                <td style={styles.desc}>
                  {item.description}
                </td>

                <td>
                  <StatusIcon
                    status={item.status === "completed"}
                  />
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
    backgroundColor: "#f97316",
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
    maxWidth: "400px",
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