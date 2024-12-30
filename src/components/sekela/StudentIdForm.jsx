import React, { useState } from "react";
import axios from "axios";
import AccountValidationForm from "./AccountValidationForm";

const StudentIdForm = () => {
  const [studentId, setStudentId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isStudentValidated, setIsStudentValidated] = useState(false);
  const [totalOutstandingFee, setTotalOutstandingFee] = useState(0);
  const [studentFullName, setStudentFullName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [months, setMonths] = useState([]); // Set as array
  const [amounts, setAmounts] = useState([]); // Set as array
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      Branch_ID: "0101",
      User_ID: "mikiyas",
      Student_ID: studentId,
    };

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/GetStudentFees",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status !== true) {
        setError(response.data.message || "An unknown error occurred.");
        setResponseData(null);
        return;
      }

      setResponseData(response.data);
      setTotalOutstandingFee(response.data.data.totalOutstandingFee);
      setStudentFullName(response.data.data.student.fullName);
      setTransactionId(response.data.transaction_ID);
      // Split the months and amounts string into arrays
      setMonths(response.data.months.split(",").map((item) => item.trim())); // Convert to array
      setAmounts(
        response.data.amounts.split(",").map((item) => parseFloat(item.trim()))
      ); // Convert to array of numbers
      setGrade(response.data.data.student.grade);
      setSchool(response.data.data.student.school);
      setIsStudentValidated(true);
      setError(null);
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while retrieving student fees.");
      setResponseData(null);
      setIsStudentValidated(false);
    }
  };

  const handleClear = () => {
    setStudentId("");
    setResponseData(null);
    setError(null);
    setIsStudentValidated(false);
    setTotalOutstandingFee(0);
    setStudentFullName("");
    setTransactionId("");
    setMonths([]);
    setAmounts([]);
    setGrade("");
    setSchool("");
  };

  return (
    <div className="flex flex-col items-center">
      {!isStudentValidated ? (
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-5">
          <div className="flex flex-col gap-5">
            <label
              className="text-dark-eval-2 font-semibold mt-4"
              htmlFor="studentId"
            >
              Enter Student ID:
            </label>
            <div className="flex gap-3 w-full">
              <input
                className="bg-green placeholder-white rounded-md p-3 w-full"
                type="text"
                id="studentId"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-3 w-32"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-500 text-white rounded-md p-3 w-32"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {error && <p className="error text-red italic font-bold">{error}</p>}

      {responseData && (
        <div className="text-left text-md font-bold mt-5 text-dark-eval-1">
          <p>Student: {studentFullName}</p>
          <p>Total Outstanding Fee: {totalOutstandingFee}</p>
        </div>
      )}

      {isStudentValidated && (
        <AccountValidationForm
          studentId={studentId}
          totalOutstandingFee={totalOutstandingFee}
          studentFullName={studentFullName}
          transactionId={transactionId}
          months={months}
          amounts={amounts}
          grade={grade}
          school={school}
          onClear={handleClear}
        />
      )}
    </div>
  );
};

export default StudentIdForm;
