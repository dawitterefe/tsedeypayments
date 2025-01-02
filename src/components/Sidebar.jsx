import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faDollarSign,
  faFileInvoice,
  faClipboardCheck,
  faChevronDown,
  faChevronUp,
  faMoneyBillWave,
  faUniversity, // Changed to faUniversity for School
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, toggleSidebar, roleId }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const location = useLocation();

  const togglePayment = () => {
    setIsPaymentOpen((prev) => !prev);
  };

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "#" && location.pathname === "/yaya") ||
      (path === "#" && location.pathname === "/sekela")
    );
  };

  return (
    <aside
      className={`fixed top-[45px] z-10 left-0 h-full bg-cyan transition-all duration-300 ease-in-out ${
        isOpen ? "w-64 opacity-100" : "w-20 opacity-90"
      }`}
    >
      <div className="p-4">
        <nav>
          <ul>
            <li className="mb-2 text-left mt-10">
              <Link
                to="/dashboard"
                className={`flex items-center p-2 rounded transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "text-yellow"
                    : "text-white hover:bg-yellow hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  className={`mr-2 transition-transform duration-300 ${
                    isOpen ? "text-lg" : "text-2xl"
                  }`}
                />
                <span
                  className={`transition-transform duration-500 ease-out delay-75 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[-20px] opacity-0"
                  }`}
                >
                  {isOpen && <span className="font-semibold">Dashboard</span>}
                </span>
              </Link>
            </li>
            <li className="mb-2 text-left">
              <Link
                to="#"
                onClick={togglePayment}
                className={`flex items-center p-2 rounded transition-all duration-300 ${
                  isActive("#")
                    ? "text-yellow "
                    : "text-white hover:bg-yellow hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className={`mr-2 transition-transform duration-300 ${
                    isOpen ? "text-lg" : "text-2xl"
                  }`}
                />
                <span
                  className={`transition-transform duration-500 ease-out delay-75 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[-20px] opacity-0"
                  }`}
                >
                  {isOpen && <span className="font-semibold">Payments</span>}
                </span>
                {isOpen && (
                  <span className="ml-2">
                    <FontAwesomeIcon
                      icon={isPaymentOpen ? faChevronUp : faChevronDown}
                      className={`font-black transition-transform duration-300 ${
                        isActive("#")
                          ? "text-yellow"
                          : "text-white hover:text-yellow"
                      }`}
                    />
                  </span>
                )}
              </Link>
              <ul
                className={`ml-4 transition-all duration-500 ease-in-out ${
                  isPaymentOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <li className="mb-2 text-left relative">
                  <Link
                    to="/yaya"
                    className={`flex items-center block p-2 rounded font-semibold transition-all duration-300 ${
                      isActive("/yaya")
                        ? "text-yellow "
                        : "text-white hover:bg-yellow hover:bg-opacity-20"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faMoneyBillWave}
                      className={`mr-2 absolute top-1/2 transform -translate-y-1/2 w-5`}
                    />
                    <span
                      className={`transition-transform duration-500 ease-out delay-75 ${
                        isOpen
                          ? "translate-x-0"
                          : "translate-x-[-20px] opacity-0"
                      }`}
                    >
                      {isOpen && (
                        <span className="ml-7 text-base">Revenue</span>
                      )}
                    </span>
                  </Link>
                </li>
                <li
                  className={`mb-2 text-left relative ${isOpen ? "-mt-5" : ""}`}
                >
                  <Link
                    to="/sekela"
                    className={`flex items-center block p-2 rounded font-semibold transition-all duration-300 ${
                      isActive("/sekela")
                        ? "text-yellow "
                        : "text-white hover:bg-yellow hover:bg-opacity-20"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faUniversity} // Update the icon to faUniversity
                      className={`mr-2 absolute top-1/2 transform -translate-y-1/2 w-5`}
                    />
                    <span
                      className={`transition-transform duration-500 ease-out delay-75 ${
                        isOpen
                          ? "translate-x-0"
                          : "translate-x-[-20px] opacity-0"
                      }`}
                    >
                      {isOpen && <span className="ml-7 text-base">School</span>}
                    </span>
                  </Link>
                </li>
              </ul>
            </li>
            {roleId === 1 && (
              <li className="mb-2 text-left">
                <Link
                  to="/supervision"
                  className={`flex items-center p-2 rounded transition-all duration-300 ${
                    isActive("/supervision")
                      ? "text-yellow"
                      : "text-white hover:bg-yellow hover:bg-opacity-20"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className={`mr-2 transition-transform duration-300 ${
                      isOpen ? "text-lg" : "text-2xl"
                    }`}
                  />
                  <span
                    className={`transition-transform duration-500 ease-out delay-75 ${
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[-20px] opacity-0"
                    }`}
                  >
                    {isOpen && (
                      <span className="font-semibold">Supervision</span>
                    )}
                  </span>
                </Link>
              </li>
            )}
            <li className="mb-2 text-left">
              <Link
                to="/payment-report"
                className={`flex items-center block p-2 rounded transition-all duration-300 ${
                  isActive("/payment-report")
                    ? "text-yellow"
                    : "text-white hover:bg-yellow hover:bg-opacity-20"
                }`}
              >
                <FontAwesomeIcon
                  icon={faFileInvoice}
                  className={`mr-2 transition-transform duration-300 ${
                    isOpen ? "text-lg" : "text-2xl"
                  }`}
                />
                <span
                  className={`transition-transform duration-500 ease-out delay-75 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[-20px] opacity-0"
                  }`}
                >
                  {isOpen && <span className="font-semibold">Report</span>}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <button
        onClick={toggleSidebar}
        className="absolute bottom-14 left-2 p-2 focus:outline-none bg-yellow hover:bg-yellow/80 text-dark-eval-2 rounded-full shadow transition-transform duration-300 transform hover:scale-110"
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;
