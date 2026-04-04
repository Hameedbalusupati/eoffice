import { useState } from "react";
import axios from "axios";

export default function DayClassWork() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    date: "",
    topic: "",
    hours_taken: "",
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
Date: ${form.date}
Topic: ${form.topic}
Hours Taken: ${form.hours_taken}

Details: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "teaching_plan",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Day class work submitted!");

      setForm({
        subject: "",
        class_name: "",
        date: "",
        topic: "",
        hours_taken: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit class work");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📘 Day Class Work</h2>

      {message && <p style={styles.message}>{message}</p>}

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
          type="date"
          name="date"
          value={form.date}
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
          type="number"
          name="hours_taken"
          placeholder="Hours Taken"
          value={form.hours_taken}
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
          Submit Work
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