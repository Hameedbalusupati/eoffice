import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function StaffSMS() {
  const [form, setForm] = useState({
    staff_name: "",
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
          `http://127.0.0.1:8000/correspondence/sms/staff/${user.id}`
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
  // 🚀 SEND SMS
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Staff: ${form.staff_name}

Message:
${form.message}
      `;

      await axios.post(
        "http://127.0.0.1:8000/correspondence/sms/send-staff",
        {
          faculty_id: user?.id,
          staff_name: form.staff_name,
          message: form.message,
          description: description,
        }
      );

      setStatusMsg("📩 Message sent to staff!");

      setForm({
        staff_name: "",
        message: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/correspondence/sms/staff/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to send SMS");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📩 Staff SMS</h2>

      {statusMsg && <p style={styles.message}>{statusMsg}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="staff_name"
          placeholder="Staff Name / ID"
          value={form.staff_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="message"
          placeholder="Enter message..."
          value={form.message}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Send SMS
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Staff</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" style={styles.noData}>
                No messages found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.staff_name}</td>

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
    backgroundColor: "#0ea5e9",
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