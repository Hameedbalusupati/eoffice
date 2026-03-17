import React, { useEffect, useState } from "react";
import API from "../services/api";

const SalaryView = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    API.get("/salary").then((res) => setSalaries(res.data));
  }, []);

  const downloadPDF = (id) => {
    window.open(`/api/salary/pdf/${id}`, "_blank");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Salary Details</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Faculty ID</th>
            <th>Net Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {salaries.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.faculty_id}</td>
              <td>{s.net_salary}</td>
              <td>
                <button
                  onClick={() => downloadPDF(s.id)}
                  className="bg-blue-500 text-white px-2"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryView;