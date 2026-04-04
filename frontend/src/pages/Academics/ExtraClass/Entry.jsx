import { useState } from "react";
import axios from "axios";

export default function ExtraClassEntry() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    date: "",
    start_time: "",
    end_time: "",
    topic: "",
    reason: "",
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
Time: ${form.start_time} - ${form.end_time}
Topic: ${form.topic}
Reason: ${form.reason}

Details: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "extra_class",
        subject: form.subject,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ Extra class recorded successfully!");

      setForm({
        subject: "",
        class_name: "",
        date: "",
        start_time: "",
        end_time: "",
        topic: "",
        reason: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit extra class");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Extra Class Entry</h2>

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
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="time"
          name="end_time"
          value={form.end_time}
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
          type="text"
          name="reason"
          placeholder="Reason for Extra Class"
          value={form.reason}
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