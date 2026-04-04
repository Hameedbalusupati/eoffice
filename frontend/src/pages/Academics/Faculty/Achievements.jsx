import { useState } from "react";
import axios from "axios";

export default function Achievements() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    organization: "",
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
Title: ${form.title}
Category: ${form.category}
Date: ${form.date}
Organization: ${form.organization}

Details: ${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "projects", // reuse activity
        subject: form.title,
        class_name: "N/A",
        description: description,
      });

      setMessage("🏆 Achievement added successfully!");

      setForm({
        title: "",
        category: "",
        date: "",
        organization: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add achievement");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🏆 Achievements</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Achievement Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="category"
          placeholder="Category (Award, Certification, etc.)"
          value={form.category}
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
          name="organization"
          placeholder="Organization / Institution"
          value={form.organization}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Achievement Description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Achievement
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
    backgroundColor: "#f59e0b",
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