import { useState } from "react";
import axios from "axios";

export default function BatchElectives() {
  const [form, setForm] = useState({
    batch_name: "",
    class_name: "",
    elective_subject: "",
    faculty_name: "",
    date: "",
    description: "",
  });

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
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Batch: ${form.batch_name}
Class: ${form.class_name}
Elective: ${form.elective_subject}
Faculty: ${form.faculty_name}
Date: ${form.date}

Notes: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "electives",
        subject: form.elective_subject,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Elective assigned successfully!");

      setForm({
        batch_name: "",
        class_name: "",
        elective_subject: "",
        faculty_name: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to assign elective");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Batch Electives</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="batch_name"
          placeholder="Batch Name"
          value={form.batch_name}
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
          name="elective_subject"
          placeholder="Elective Subject"
          value={form.elective_subject}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="faculty_name"
          placeholder="Faculty Name"
          value={form.faculty_name}
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
          name="description"
          placeholder="Additional Notes"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Assign Elective
        </button>
      </form>
    </div>
  );
}


// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "450px",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};