import React, { useEffect, useState } from "react";
import API from "../services/api";

const FacultyReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/report").then((res) => setReports(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Faculty Reports</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.net_salary}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyReport;