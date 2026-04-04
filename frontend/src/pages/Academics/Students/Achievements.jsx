import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function ProjectReviews() {
  const [form, setForm] = useState({
    project_title: "",
    class_name: "",
    reviewer: "",
    rating: "",
    feedback: "",
  });

  const [data, setData] = useState([]);
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
  // 📄 FETCH REVIEWS (FIXED)
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/project-reviews/${user.id}`
        );

        if (!ignore) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // =========================
  // 🚀 ADD REVIEW
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Reviewer: ${form.reviewer}
Rating: ${form.rating}

Feedback:
${form.feedback}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "project_reviews",
        subject: form.project_title,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("📝 Review added successfully!");

      setForm({
        project_title: "",
        class_name: "",
        reviewer: "",
        rating: "",
        feedback: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/project-reviews/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add review");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📝 Project Reviews</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="project_title"
          placeholder="Project Title"
          value={form.project_title}
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
          name="reviewer"
          placeholder="Reviewer Name"
          value={form.reviewer}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Rating</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="5">5 ⭐</option>
        </select>

        <textarea
          name="feedback"
          placeholder="Feedback"
          value={form.feedback}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Review
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Class</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No reviews found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>

                <td style={styles.desc}>
                  {item.description}
                </td>

                <td>
                  <StatusIcon
                    status={item.status === "completed"}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
    gap: "10px",
    maxWidth: "450px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    minHeight: "80px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#7c3aed",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  desc: {
    maxWidth: "400px",
    wordWrap: "break-word",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};