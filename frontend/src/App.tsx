import React from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import "./App.css";
import SelectDemoPage from "./components/select-demo-page";
import DemoWebhookCallsPage from "./components/demo-webhook-calls-page";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SelectDemoPage />} />
        <Route path="/demo/:demoId" element={<DemoWebhookCallsPage />} />
      </Routes>
    </>
  );
}

export default App;
