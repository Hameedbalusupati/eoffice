import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BarCharts() {
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  // =========================
  // 📄 FETCH DATA
  // =========================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/library/chart-data"
        );

        if (!ignore) {
          setCategoryData(res.data.category);
          setStatusData(res.data.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2>📊 Library Dashboard</h2>

      {/* ================= CATEGORY CHART ================= */}
      <div style={styles.chartBox}>
        <h3>📚 Books by Category</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= STATUS CHART ================= */}
      <div style={styles.chartBox}>
        <h3>📊 Book Status</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
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

  chartBox: {
    marginBottom: "40px",
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "10px",
  },
};