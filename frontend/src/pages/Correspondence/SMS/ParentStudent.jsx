import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function MarksAttendance() {
  const [form, setForm] = useState({
    roll_no: "",
    subject: "",
    marks: "",
    attendance: "",
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
  // 📄 FETCH HISTORY
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/correspondence/sms/marks-attendance/${user.id}`
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
Subject: ${form.subject}
Marks: ${form.marks}
Attendance: ${form.attendance}%
      `;

      await axios.post(
        "http://127.0.0.1:8000/correspondence/sms/send-marks-attendance",
        {
          faculty_id: user?.id,
          roll_no: form.roll_no,
          subject: form.subject,
          marks: form.marks,
          attendance: form.attendance,
          description: description,
        }
      );

      setMessage("📩 SMS sent successfully!");

      setForm({
        roll_no: "",
        subject: "",
        marks: "",
        attendance: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/correspondence/sms/marks-attendance/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send SMS");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📊 Marks & Attendance SMS</h2>

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
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="marks"
          placeholder="Marks"
          value={form.marks}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="attendance"
          placeholder="Attendance (%)"
          value={form.attendance}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Send SMS
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Attendance</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.roll_no}</td>
                <td>{item.subject}</td>
                <td>{item.marks}</td>
                <td>{item.attendance}%</td>

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
    backgroundColor: "#7c3aed",
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