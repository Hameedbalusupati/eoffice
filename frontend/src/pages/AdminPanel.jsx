import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminPanel = () => {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
  });

  // ✅ SAFE useEffect (no warning)
  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const res = await API.get("/faculty");
        setFaculty(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadFaculty();
  }, []);

  // ✅ Reusable function (outside effect)
  const fetchFaculty = async () => {
    try {
      const res = await API.get("/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/faculty", form);

      // reset form
      setForm({
        name: "",
        email: "",
        department: "",
        designation: "",
        salary: "",
      });

      fetchFaculty(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Admin Panel</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            value={form[key]}
            placeholder={key}
            className="border p-2 w-full"
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}
        <button className="bg-green-500 text-white p-2">
          Add Faculty
        </button>
      </form>

      {/* Faculty List */}
      <ul className="mt-4">
        {faculty.map((f) => (
          <li key={f.id}>
            {f.name} - {f.department}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;