// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Summarizer from "./pages/Summarizer";
import Mindmap from "./pages/Mindmap";
import Chatbot from "./pages/Chatbot";
import ViewMindmap from "./pages/ViewMindmap";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";


import "./styles/global.css";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/"
          element={
            <div className="container" style={{ paddingTop: "30px" }}>
              <Home />
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="container" style={{ paddingTop: "30px" }}>
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/summarizer"
          element={
            <ProtectedRoute>
              <div className="container" style={{ paddingTop: "30px" }}>
                <Summarizer />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mindmap"
          element={
            <ProtectedRoute>
              <div className="container" style={{ paddingTop: "30px" }}>
                <Mindmap />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <div className="container" style={{ paddingTop: "30px" }}>
                <Chatbot />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
  path="/view-mindmap/:id"
  element={
    <ProtectedRoute>
      <ViewMindmap />
    </ProtectedRoute>
  }
/>

      </Routes>

      
    </>
  );
}
