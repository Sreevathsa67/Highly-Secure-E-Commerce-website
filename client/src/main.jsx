import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js"; // Adjust path if needed
import App from "./App.jsx"; // Adjust path if needed
import { Toaster } from "./components/ui/toaster.jsx"; // Adjust path if needed
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  );
} else {
  console.error("Root element not found");
}
