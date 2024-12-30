import React, { useState } from "react";
import axios from "axios";

const PaymentForm = ({ accountDetails, totalDue, onClear }) => {
  const [narration, setNarration] = useState("");
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const uniqueID = `${accountDetails.accountNumber}`;
    const requestBody = {
      CustomerID: "1648094426",
      Country: "ETHIOPIATEST",
      BankID: "02",
      UniqueID: uniqueID,
      FunctionName: "GETNAME",
      ISOFieldsRequest: null,
      ISOFieldsResponse: null,
      PaymentDetails: {
        MerchantID: "YAYAPAYMENT",
        FunctionName: "GETNAME",
        AccountID: "amhararbor11",
        Amount: totalDue.toString(), // Use the total due amount
        ReferenceNumber: uniqueID,
      },
      InfoFields: {
        InfoField1: accountDetails.billId,
        InfoField2: accountDetails.phoneNumber,
        InfoField3: accountDetails.customerName,
        InfoField7: accountDetails.accountNumber,
        InfoField15: "2305130004083",
        InfoField16: narration,
      },
      MerchantConfig: {
        DLLCallID: "YAYAPAYMENT",
        MerchantCode: "YAYAPAYMENT",
        MerchantName: "YAYAPAYMENT",
        TrxAuthontication: null,
        MerchantProvider: "YAYA",
        MerchantURL: "https://localhost:44396/api/dynamic/Validate",
        MerchantReference: "{DATE}{STAN}",
      },
      ISOResponseFields: null,
      ResponseDetail: null,
      Customerdetail: {
        CustomerID: "1648094426",
        Country: "ETHIOPIATEST",
        MobileNumber: "251905557471",
        EmailID: "jack.njama@craftsilicon.com",
        FirstName: "Jack",
        LastName: "Njama",
      },
      ISORequest: null,
      ResponseFields: null,
      AppDetail: {
        AppName: "TSEDEY",
        Version: "1.8.17",
        CodeBase: "ANDROID",
        LATLON: "-1.2647891,36.7632677",
        TrxSource: "APP",
        DeviceNotificationID: "",
        DeviceIMEI: "148e122c64a564f2",
        DeviceIMSI: "148e122c64a564f2",
        ConnString: "",
      },
    };

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/YAYA/B2YaYa",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        setPaymentResponse(response.data);
        setPaymentError(null);
      } else {
        setPaymentError(`Unexpected response: No data returned.`);
      }
    } catch (err) {
      console.error("Payment Error Details: ", err);
      setPaymentError("An error occurred while processing your payment.");
    }
  };

  const handleClear = () => {
    // Calls the onClear function from the props to reset everything
    onClear();
    // Clear current payment response and error as well
    setNarration("");
    setPaymentResponse(null);
    setPaymentError(null);
  };

  return (
    <div>
      {!paymentResponse ? (
        <form onSubmit={handlePaymentSubmit}>
          <input
            className="bg-gray-400 text-gray-950 placeholder-gray-950 rounded-md p-3"
            type="text"
            id="narration"
            placeholder="Enter Payment Narration"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{ margin: "10px", padding: "10px 20px" }}
          >
            Make Payment
          </button>
        </form>
      ) : (
        <div className="text-left text-md font-bold mt-5 text-dark-eval-1">
          <h3 className="text-green1 text-xl font-bold italic">
            Payment Successful!
          </h3>

          <div>
            <p>
              Tsedey Reference: {paymentResponse.extraData?.TsedeyReference}
            </p>
            <p>YaYa Reference: {paymentResponse.extraData?.YaYaReference}</p>
          </div>

          <button
            className="text-gray-300 bg-gray-900"
            onClick={handleClear}
            style={{ marginTop: "10px", padding: "10px 20px" }}
          >
            Clear
          </button>
        </div>
      )}

      {paymentError && <p className="error">{paymentError}</p>}
      <p className="mt-1 font-xs">Total Due Amount: {totalDue}</p>
    </div>
  );
};

export default PaymentForm;
