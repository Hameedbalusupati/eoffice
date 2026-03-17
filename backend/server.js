const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/salary", require("./routes/salaryRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);