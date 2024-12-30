import React, { useState } from "react";
import axios from "axios";

const PaymentSavingForm = ({ accountDetails, totalDue, onClear }) => {
  const [narration, setNarration] = useState("");
  const [saveResponse, setSaveResponse] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [requestBody, setRequestBody] = useState({}); // Store request body for preview

  const handlePaymentSave = async (e) => {
    e.preventDefault();

    // Check if accountDetails and totalDue are defined
    // if (!accountDetails || accountDetails.totalDue === undefined) {
    //   setSaveError("Total due amount is not defined.");
    //   return;
    // }

    // Get current date-time in a specific format
    const currentDate = new Date().toLocaleString();

    // Prepare the request body
    const requestPayload = {
      Amount: totalDue,
      Client_yaya_account: "amhararbor11",
      Client_Name: accountDetails.clientName,
      Customer_Account: accountDetails.accountNumber,
      Customer_Name: accountDetails.customerName,
      Customer_Phone_Number: accountDetails.phoneNumber,
      Transfer_To: "1201160002517", // Static value
      Branch_ID: "0101", // Static value
      CreatedOn: currentDate,
      CreatedBy: "THEMAKER", // Static value or dynamically set
      Bill_ID: accountDetails.billId, // Ensure Bill ID is passed here
      Narration: narration,
    };

    console.log("Request Body Before Saving:", requestPayload); // Log the request body

    setRequestBody(requestPayload); // Save to state for displaying

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/SavePaymentDetail",
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
    onClear(); // Call clear function from parent component
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow">
      {/* Optional: Display request body for debugging */}
      {/* <h3 className="font-bold">Request Body for Saving:</h3> */}
      {/* <pre>{JSON.stringify(requestBody, null, 2)}</pre> */}

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
        Total Due Amount: {totalDue}
      </p>
    </div>
  );
};

export default PaymentSavingForm;
