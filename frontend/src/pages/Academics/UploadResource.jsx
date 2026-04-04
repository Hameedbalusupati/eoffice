import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../components/StatusIcon";

export default function UploadResources() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_name: "",
    link: "",
  });

  const [file, setFile] = useState(null);
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
  // 📁 HANDLE FILE
  // =========================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
          `http://127.0.0.1:8000/academics/upload-resources/${user.id}`
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
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("faculty_id", user?.id);
      formData.append("title", form.title);
      formData.append("subject", form.subject);
      formData.append("class_name", form.class_name);
      formData.append("link", form.link);

      if (file) {
        formData.append("file", file);
      }

      await axios.post(
        "http://127.0.0.1:8000/academics/upload-resource",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("📁 Resource uploaded successfully!");

      setForm({
        title: "",
        subject: "",
        class_name: "",
        link: "",
      });

      setFile(null);

      // 🔄 refresh
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/upload-resources/${user.id}`
      );
      setData(res.data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>📁 Upload Resources</h2>

      {message && <p style={styles.message}>{message}</p>}

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
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
          placeholder="Optional Link (Drive / YouTube)"
          value={form.link}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="file"
          onChange={handleFileChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Class</th>
            <th>File</th>
            <th>Link</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.noData}>
                No resources uploaded
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.subject}</td>
                <td>{item.class_name}</td>

                <td>
                  {item.file_url ? (
                    <a href={item.file_url} target="_blank" rel="noreferrer">
                      📄 View
                    </a>
                  ) : "—"}
                </td>

                <td>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      🔗 Open
                    </a>
                  ) : "—"}
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
    maxWidth: "400px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
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