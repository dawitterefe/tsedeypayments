import React from "react";
import customImage from "../assets/images/tsedeylogo.png";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header
      className="z-50 bg-gray-100 text-white flex justify-between items-center fixed top-0 left-0 right-0 shadow-md 
     transition-all duration-300"
    >
      <div className="flex flex-row items-center gap-2">
        {" "}
        <div className="flex flex-row items-center gap-2">
          <div>
            <img
              className="w-[40px] h-auto mx-auto"
              src={customImage}
              alt="Amhara National Regional State Revenue Authority"
            />
          </div>
          <div className="text-dark-eval-1">{" Tsedey Bank S.C "}</div>
        </div>
      </div>

      <div className="flex items-center pr-4">
        <img
          src="https://via.placeholder.com/30"
          alt="User Avatar"
          className="rounded-full border border-white"
        />
        <span className="font-semibold mx-2 text-dark-eval-2">User Name</span>
      </div>
    </header>
  );
};

export default Navbar;
