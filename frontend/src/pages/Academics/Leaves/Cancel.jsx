import { useEffect, useState } from "react";
import axios from "axios";
import StatusIcon from "../../../components/StatusIcon";

export default function LeaveCancel() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 📄 FETCH USER LEAVES (FIXED)
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/academics/leaves/user/${user.id}`
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
  // 🔄 REFRESH
  // =========================
  const refreshData = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/academics/leaves/user/${user.id}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // ❌ CANCEL LEAVE
  // =========================
  const handleCancel = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/academics/leaves/${id}`
      );

      setMessage("❌ Leave canceled successfully");
      refreshData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to cancel leave");
    }
  };

  return (
    <div style={styles.container}>
      <h2>❌ Cancel Leave</h2>

      {message && <p style={styles.message}>{message}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noData}>
                No leave records
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>
                <td>{item.reason}</td>

                <td>
                  <StatusIcon status={item.status === "approved"} />
                </td>

                <td>
                  {item.status === "pending" ? (
                    <button
                      onClick={() => handleCancel(item.id)}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  ) : (
                    "Not Allowed"
                  )}
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
  container: {
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  cancelBtn: {
    padding: "5px 10px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },

  message: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
};