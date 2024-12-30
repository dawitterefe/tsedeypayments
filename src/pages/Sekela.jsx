import React from "react";
import BillIdForm from "../components/yaya/BillIdForm";
import sekelaImage from "../assets/images/sekela.png";
import StudentIdForm from "../components/sekela/StudentIdForm";

const YaYa = () => {
  return (
    <div className="text-center p-6">
      {" "}
      <div className="my-4 mt-14">
        {" "}
        <img
          className="w-[250px] h-auto mx-auto -mt-8"
          src={sekelaImage}
          alt="Amhara National Regional State Revenue Authority"
        />
      </div>
      <h2 className="my-5 font-bold text-xl text-dark-eval-1">
        Sekela School Fee Payment System
      </h2>{" "}
      <div className="mt-10">
        <StudentIdForm />
      </div>
    </div>
  );
};

export default YaYa;
