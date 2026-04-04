import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyAdjustmentEntry() {
  const [form, setForm] = useState({
    subject: "",
    class_name: "",
    date: "",
    time: "",
    replacement_faculty: "",
    signature: null,
    description: "",
  });

  const [freeFaculty, setFreeFaculty] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 🔄 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "signature") {
      setForm({ ...form, signature: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // =========================
  // 🔥 FETCH FREE FACULTY (FINAL FIX)
  // =========================
  useEffect(() => {
    if (!form.date || !form.time) return;

    let ignore = false; // ✅ prevents unwanted re-renders

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/schedule/free-faculty?date=${form.date}&time=${form.time}`
        );

        if (!ignore) {
          setFreeFaculty(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      ignore = true; // cleanup
    };
  }, [form.date, form.time]); // ✅ correct dependencies

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("faculty_id", user?.id);
      formData.append("activity_name", "faculty_adjustments");
      formData.append("subject", form.subject);
      formData.append("class_name", form.class_name);
      formData.append("replacement_faculty", form.replacement_faculty);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("description", form.description);
      formData.append("signature", form.signature);

      await axios.post(
        "http://127.0.0.1:8000/academics/adjustment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Faculty adjustment recorded successfully!");

      setForm({
        subject: "",
        class_name: "",
        date: "",
        time: "",
        replacement_faculty: "",
        signature: null,
        description: "",
      });

      setFreeFaculty([]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to record adjustment");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔄 Faculty Adjustment Entry</h2>

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
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* 🔥 FREE FACULTY */}
        <select
          name="replacement_faculty"
          value={form.replacement_faculty}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Available Faculty</option>
          {freeFaculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* ✍ SIGNATURE */}
        <input
          type="file"
          name="signature"
          accept="image/*"
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Reason for adjustment"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Submit Adjustment
        </button>
      </form>
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
    backgroundColor: "#7c3aed",
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