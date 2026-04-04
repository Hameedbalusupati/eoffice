import { useState } from "react";
import axios from "axios";

export default function GeneralAttendance() {
  const [form, setForm] = useState({
    title: "",
    class_name: "",
    date_range: "",
    summary: "",
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
Title: ${form.title}
Class: ${form.class_name}
Date Range: ${form.date_range}
Summary: ${form.summary}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "attendance_reports",
        subject: form.title,
        class_name: form.class_name,
        description: description,
      });

      setMessage("✅ General attendance report submitted!");

      setForm({
        title: "",
        class_name: "",
        date_range: "",
        summary: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit report");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📊 General Attendance Report</h2>

      {/* 🔔 Message */}
      {message && <p style={styles.message}>{message}</p>}

      {/* 📋 Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Report Title (e.g. Weekly Report)"
          value={form.title}
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
          name="date_range"
          placeholder="Date Range (e.g. 01-04-2026 to 07-04-2026)"
          value={form.date_range}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="summary"
          placeholder="Enter attendance summary"
          value={form.summary}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Report
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
    backgroundColor: "#16a34a",
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