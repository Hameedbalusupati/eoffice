import { useState } from "react";
import axios from "axios";

export default function AcademicRegister() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    topic: "",
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
  // 🚀 SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Date: ${form.date}
Topic: ${form.topic}
Details: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "academic_register",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Academic register entry added successfully!");

      setForm({
        subject: "",
        class_name: "",
        topic: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit data");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📘 Academic Register</h2>

      {/* 🔔 Message */}
      {message && <p style={styles.message}>{message}</p>}

      {/* 📋 Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
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
          name="topic"
          placeholder="Topic Covered"
          value={form.topic}
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
          Submit Entry
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
    minHeight: "100px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
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