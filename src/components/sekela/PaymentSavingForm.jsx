import React, { useState } from "react";
import axios from "axios";

const PaymentSavingForm = ({ paymentDetails, onClear }) => {
  const [narration, setNarration] = useState("");
  const [saveResponse, setSaveResponse] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handlePaymentSave = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleString();

    const requestPayload = {
      Student_ID: paymentDetails.studentId,
      Total_Amount: paymentDetails.totalOutstandingFee.toString(),
      Customer_Account: paymentDetails.accountNumber,
      Customer_Name: paymentDetails.customerName,
      Student_Name: paymentDetails.studentFullName,
      To_Account: "2305130003340",
      Customer_Phone: paymentDetails.phoneNumber,
      Branch_ID: "0101",
      Created_By: "Maker",
      Created_On: currentDate,
      Narration: narration,
      Transaction_ID: paymentDetails.transactionId,
      Months: paymentDetails.months.join(","),
      Amounts_Per_Month: paymentDetails.amounts.join(","),
      Grade: paymentDetails.grade,
      School: paymentDetails.school,
    };

    console.log("Request Payload:", requestPayload);

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/SekelaSavePayment",
        requestPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      setSaveResponse(response.data);
      setSaveError(null);
    } catch (err) {
      console.error("Save Payment Error Details: ", err);
      setSaveError("An error occurred while saving the payment details.");
      setSaveResponse(null);
    }
  };

  const handleClear = () => {
    setNarration("");
    setSaveResponse(null);
    setSaveError(null);
    onClear();
  };

  const requestPayloadPreview = {
    Student_ID: paymentDetails.studentId,
    Total_Amount: paymentDetails.totalOutstandingFee.toString(),
    Customer_Account: paymentDetails.accountNumber,
    Customer_Name: paymentDetails.customerName,
    Student_Name: paymentDetails.studentFullName,
    To_Account: "2305130003340",
    Customer_Phone: paymentDetails.phoneNumber,
    Branch_ID: "0101",
    Created_By: "Maker",
    Created_On: new Date().toLocaleString(),
    Narration: narration,
    Transaction_ID: paymentDetails.transactionId,
    Months: paymentDetails.months.join(","),
    Amounts: paymentDetails.amounts.join(","),
    Grade: paymentDetails.grade,
    School: paymentDetails.school,
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow">
      {!saveResponse ? (
        <form onSubmit={handlePaymentSave}>
          <div className="mb-4">
            <input
              className="bg-green text-white placeholder-white rounded-md p-3 w-full"
              type="text"
              id="narration"
              placeholder="Enter Payment Narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save Payment
          </button>
          <div className="mt-4">
            <h4 className="font-semibold">Request Payload Preview:</h4>
            <pre className="bg-gray-100 p-3 rounded overflow-auto">
              <code>{JSON.stringify(requestPayloadPreview, null, 2)}</code>
            </pre>
          </div>
        </form>
      ) : (
        <div className="text-left text-md font-bold mt-5">
          {saveResponse.status === "200" ? (
            <h3 className="text-green1 text-xl font-bold italic">
              {saveResponse.message}
            </h3>
          ) : (
            <h3 className="text-red text-xl font-bold italic">
              {saveResponse.message}
            </h3>
          )}
          <button
            className="text-white bg-cyan-600 mt-2 py-2 px-4 rounded"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}
      {saveError && <p className="error text-red">{saveError}</p>}
      <p className="mt-1 font-xs text-dark-eval-2">
        Total: {paymentDetails.totalOutstandingFee}
      </p>
    </div>
  );
};

export default PaymentSavingForm;
