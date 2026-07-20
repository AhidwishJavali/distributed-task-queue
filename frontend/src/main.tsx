  import React from "react";
  import ReactDOM from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
  ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
    <BrowserRouter>
        <App />

        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                success: {
                    style: {
                        background: "#16a34a",
                    },
                },
                error: {
                    style: {
                        background: "#dc2626",
                    },
                },
            }}
        />
    </BrowserRouter>
</React.StrictMode>
  );