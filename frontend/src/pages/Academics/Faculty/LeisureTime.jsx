import { useState } from "react";
import axios from "axios";

export default function LeisureTime() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    activity_type: "leisure", // 🔥 default
    title: "",
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
      // 🔥 Decide status based on activity type
      const isWork =
        form.activity_type === "fdp" ||
        form.activity_type === "research" ||
        form.activity_type === "workshop" ||
        form.activity_type === "seminar";

      const status = isWork ? "completed" : "pending";

      const description = `
Date: ${form.date}
Time: ${form.time}
Type: ${form.activity_type}
Title: ${form.title}

Details: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "leisure_time",
        subject: form.title,
        class_name: "N/A",
        description: description,
        status: status, // 🔥 dynamic
      });

      setMessage(
        isWork
          ? "✅ Work activity recorded (Completed)"
          : "🕒 Leisure recorded (Pending)"
      );

      setForm({
        date: "",
        time: "",
        activity_type: "leisure",
        title: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save data");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🕒 Leisure / Other Work</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Time */}
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* 🔥 Activity Type */}
        <select
          name="activity_type"
          value={form.activity_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="leisure">Leisure</option>
          <option value="fdp">FDP</option>
          <option value="research">Research Paper</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
        </select>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title / Work Name"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit
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
    maxWidth: "400px",
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
    backgroundColor: "#9333ea",
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