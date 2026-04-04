import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function Greetings() {
  const [form, setForm] = useState({
    name: "",
    type: "birthday",
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
          `http://127.0.0.1:8000/correspondence/greetings/${user.id}`
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
  // 🚀 SEND GREETING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Name: ${form.name}
Type: ${form.type}

Message:
${form.message}
      `;

      await axios.post(
        "http://127.0.0.1:8000/correspondence/greeting",
        {
          sender_id: user?.id,
          name: form.name,
          type: form.type,
          message: form.message,
          description: description,
        }
      );

      setStatusMsg("🎉 Greeting sent successfully!");

      setForm({
        name: "",
        type: "birthday",
        message: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/correspondence/greetings/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to send greeting");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎉 Greetings</h2>

      {statusMsg && <p style={styles.message}>{statusMsg}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Recipient Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="birthday">Birthday 🎂</option>
          <option value="festival">Festival 🎊</option>
          <option value="congratulations">Congratulations 🎉</option>
        </select>

        <textarea
          name="message"
          placeholder="Enter greeting message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Send Greeting
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No greetings sent
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>

                <td style={styles.desc}>
                  {item.message}
                </td>

                <td>
                  <StatusIcon status={true} />
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
    backgroundColor: "#f59e0b",
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