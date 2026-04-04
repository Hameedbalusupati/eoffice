import { useState } from "react";
import axios from "axios";

export default function WorkOrder() {
  const [form, setForm] = useState({
    title: "",
    order_number: "",
    assigned_by: "",
    priority: "",
    deadline: "",
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
Work Order: ${form.order_number}
Assigned By: ${form.assigned_by}
Priority: ${form.priority}
Deadline: ${form.deadline}

Details:
${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "work_order",
        subject: form.title,
        class_name: "N/A",
        description: description,
        status: "completed", // ✔️ official work
      });

      setMessage("📄 Work order recorded successfully!");

      setForm({
        title: "",
        order_number: "",
        assigned_by: "",
        priority: "",
        deadline: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save work order");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📄 Work Order</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Work Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="order_number"
          placeholder="Order Number"
          value={form.order_number}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="assigned_by"
          placeholder="Assigned By"
          value={form.assigned_by}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Work Details"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Work Order
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
    backgroundColor: "#dc2626",
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