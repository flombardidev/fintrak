import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind
import AppRouter from "./app/AppRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
