import "./StatusIcon.css";

export default function StatusIcon({ status }) {
  return (
    <span
      className={`status-icon ${status ? "completed" : "pending"}`}
      title={status ? "Completed" : "Pending"}
    >
      {status ? "✔️" : "❌"}
    </span>
  );
}