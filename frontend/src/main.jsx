import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f0f7f3;
    color: #222;
    -webkit-font-smoothing: antialiased;
  }

  html { scroll-behavior: smooth; }
  a { text-decoration: none; }
  input, button, textarea, select { font-family: inherit; }
  input:focus { outline: 2px solid #1a6b3c; outline-offset: 1px; }
  button:hover { opacity: 0.9; }
  button:active { transform: scale(0.98); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: #1a6b3c66; border-radius: 3px; }

  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
