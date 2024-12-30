import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import YaYa from "./pages/YaYa";
import Sekela from "./pages/Sekela";
import Supervision from "./pages/Supervision"; // Import the Supervision component
import PaymentReport from "./pages/PaymentReport"; // Import the PaymentReport component
import "./App.css";
import "./index.css";

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const roleId = 1; // Static role ID for testing

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          roleId={roleId} // Pass roleId to Sidebar
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="p-6 mt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/yaya" element={<YaYa />} />
              <Route path="/sekela" element={<Sekela />} />{" "}
              <Route path="/supervision" element={<Supervision />} />{" "}
              {/* Add Supervision route */}
              <Route path="/payment-report" element={<PaymentReport />} />{" "}
              {/* Add PaymentReport route */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
