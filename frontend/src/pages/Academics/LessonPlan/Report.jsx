import { useState } from "react";
import axios from "axios";

export default function LessonPlanEntry() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    unit: "",
    topic: "",
    date: "",
    hours: "",
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
Unit: ${form.unit}
Topic: ${form.topic}
Date: ${form.date}
Hours: ${form.hours}

Details:
${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "lesson_plan",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("✅ Lesson plan created successfully!");

      setForm({
        subject: "",
        class_name: "",
        unit: "",
        topic: "",
        date: "",
        hours: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create lesson plan");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📘 Lesson Plan Entry</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* SUBJECT */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* CLASS */}
        <input
          type="text"
          name="class_name"
          placeholder="Class"
          value={form.class_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* UNIT */}
        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* TOPIC */}
        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={form.topic}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* DATE */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* HOURS */}
        <input
          type="number"
          name="hours"
          placeholder="Hours"
          value={form.hours}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Additional Notes"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Create Lesson Plan
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