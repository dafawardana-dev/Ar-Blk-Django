// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Sidebar from "./component/layouts/Sidebar.jsx";
import Navbar from "./component/layouts/Navbar.jsx";
import ArsipPage from "./pages/ArsipPage.jsx";

export default function App() {
  return (
    
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/arsip" element={<ArsipPage/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
