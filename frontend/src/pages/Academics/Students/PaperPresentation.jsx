import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function PaperPresentation() {
  const [form, setForm] = useState({
    student_name: "",
    roll_no: "",
    class_name: "",
    title: "",
    conference: "",
    presentation_type: "",
    award: "",
    date: "",
    description: "",
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
  // 📄 FETCH DATA (FIXED)
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/paper-presentations/${user.id}`
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
  // 🚀 ADD PRESENTATION
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Student: ${form.student_name}
Roll No: ${form.roll_no}
Title: ${form.title}
Conference: ${form.conference}
Type: ${form.presentation_type}
Award: ${form.award}
Date: ${form.date}

Details:
${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "paper_presentation",
        subject: form.title,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("🎤 Paper presentation added successfully!");

      setForm({
        student_name: "",
        roll_no: "",
        class_name: "",
        title: "",
        conference: "",
        presentation_type: "",
        award: "",
        date: "",
        description: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/paper-presentations/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add presentation");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎤 Paper Presentations</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="student_name"
          placeholder="Student Name"
          value={form.student_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="roll_no"
          placeholder="Roll Number"
          value={form.roll_no}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="class_name"
          placeholder="Class"
          value={form.class_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="title"
          placeholder="Paper Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="conference"
          placeholder="Conference / Event"
          value={form.conference}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="presentation_type"
          value={form.presentation_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Type</option>
          <option value="oral">Oral</option>
          <option value="poster">Poster</option>
        </select>

        <input
          type="text"
          name="award"
          placeholder="Award / Prize"
          value={form.award}
          onChange={handleChange}
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
          name="description"
          placeholder="Additional Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Presentation
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No presentations found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>

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
    maxWidth: "450px",
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
    minHeight: "80px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#db2777",
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