import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function Resources() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_name: "",
    link: "",
    description: "",
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
  // 📄 FETCH RESOURCES
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/resources/${user.id}`
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
  // 🚀 ADD RESOURCE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const description = `
Link: ${form.link}

Details:
${form.description}
      `;

      await axios.post("http://127.0.0.1:8000/academics/create", {
        faculty_id: user?.id,
        activity_name: "resources",
        subject: form.title,
        class_name: form.class_name,
        description: description,
        status: "completed",
      });

      setMessage("📚 Resource added successfully!");

      setForm({
        title: "",
        subject: "",
        class_name: "",
        link: "",
        description: "",
      });

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/resources/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add resource");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📚 Resources</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Resource Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

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
          type="url"
          name="link"
          placeholder="Resource Link (Google Drive / PDF)"
          value={form.link}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Add Resource
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Description</th>
            <th>Link</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No resources found
              </td>
            </tr>
          ) : (
            data.map((item) => {
              // extract link from description
              const linkMatch = item.description.match(/Link:\s*(.*)/);
              const link = linkMatch ? linkMatch[1] : "#";

              return (
                <tr key={item.id}>
                  <td>{item.subject}</td>
                  <td>{item.class_name}</td>

                  <td style={styles.desc}>
                    {item.description}
                  </td>

                  <td>
                    <a href={link} target="_blank" rel="noreferrer">
                      🔗 Open
                    </a>
                  </td>

                  <td>
                    <StatusIcon
                      status={item.status === "completed"}
                    />
                  </td>
                </tr>
              );
            })
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
    backgroundColor: "#0891b2",
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
    maxWidth: "300px",
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