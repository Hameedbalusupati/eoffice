import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Get root element
const rootElement = document.getElementById("root");

// Safety check
if (!rootElement) {
  throw new Error("Root element not found");
}

// Render React App
ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);