import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function ExamAttendance() {
  const [form, setForm] = useState({
    roll_no: "",
    exam_name: "",
    status: "present",
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
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/correspondence/sms/exam-attendance/${user.id}`
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
Roll No: ${form.roll_no}
Exam: ${form.exam_name}
Status: ${form.status}
      `;

      await axios.post(
        "http://127.0.0.1:8000/correspondence/sms/send-exam-attendance",
        {
          faculty_id: user?.id,
          roll_no: form.roll_no,
          exam_name: form.exam_name,
          status: form.status,
          description: description,
        }
      );

      setMessage("📩 SMS sent successfully!");

      setForm({
        roll_no: "",
        exam_name: "",
        status: "present",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/correspondence/sms/exam-attendance/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send SMS");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📩 Exam Attendance SMS</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="roll_no"
          placeholder="Student Roll No"
          value={form.roll_no}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="exam_name"
          placeholder="Exam Name (e.g. Mid-1)"
          value={form.exam_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button type="submit" style={styles.button}>
          Send SMS
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Exam</th>
            <th>Status</th>
            <th>Description</th>
            <th>Sent</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.roll_no}</td>
                <td>{item.exam_name}</td>
                <td>{item.status}</td>

                <td style={styles.desc}>
                  {item.description}
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

  button: {
    padding: "10px",
    backgroundColor: "#dc2626",
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