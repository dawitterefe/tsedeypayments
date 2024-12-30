import React from "react";
import BillIdForm from "../components/yaya/BillIdForm";
import customImage from "../assets/images/yaya.png";

const YaYa = () => {
  return (
    <div className="text-center p-6">
      {" "}
      <div>
        <div className="my-4 mt-14">
          {" "}
          <img
            className="w-[120px] h-auto mx-auto -mt-8"
            src={customImage}
            alt="Amhara National Regional State Revenue Authority"
          />
        </div>
        <h2 className="my-5 font-bold text-xl text-dark-eval-1">
          YAYA Revenue Payment System
        </h2>{" "}
      </div>
      <div className="mt-10">
        <BillIdForm />
      </div>
    </div>
  );
};

export default YaYa;
