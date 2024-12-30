import React, { useState } from "react";
import axios from "axios";
import AccountValidationForm from "./AccountValidationForm";

const BillIdForm = () => {
  const [billId, setBillId] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isBillValidated, setIsBillValidated] = useState(false);
  const [totalDue, setTotalDue] = useState(0);
  const [accountName, setAccountName] = useState(""); // State to hold account name
  const [accountId, setAccountId] = useState(""); // Set default account ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      CustomerID: "1648094426",
      Country: "ETHIOPIATEST",
      BankID: "02",
      UniqueID: "aba47c60-e606-11ee-b720-f51215b66fxx",
      FunctionName: "GETNAME",
      ISOFieldsRequest: null,
      ISOFieldsResponse: null,
      PaymentDetails: {
        MerchantID: "YAYAPAYMENT",
        FunctionName: "GETNAME",
        AccountID: accountId,
        Amount: "0",
        ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
      },
      InfoFields: {
        InfoField1: billId,
        InfoField2: null,
        InfoField3: null,
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
        "http://10.10.105.21:7271/api/YAYA/GetPendingBill",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status !== "200") {
        setError(response.data.message || "An unknown error occurred.");
        setResponseData(null);
        setIsBillValidated(false);
        return;
      }

      setResponseData(response.data);
      setTotalDue(response.data.extraData?.TotalDue || 0);
      setAccountName(response.data.accountName);
      setIsBillValidated(true);
      setError(null);
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while validating the bill ID.");
      setResponseData(null);
      setIsBillValidated(false);
    }
  };

  const handleClear = () => {
    setBillId("");
    setResponseData(null);
    setError(null);
    setIsBillValidated(false);
    setTotalDue(0);
    setAccountId("");
  };

  return (
    <div className="flex flex-col items-center">
      {!isBillValidated ? (
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-5">
          <div className="flex flex-col gap-5">
            <label
              className="text-dark-eval-2 font-semibold"
              htmlFor="accountId"
            >
              Please select Account to proceed:
            </label>
            <select
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="bg-green text-white rounded-md p-3 w-full"
            >
              <option value="" disabled>
                Select Account
              </option>
              <option value="amhararbor11">
                AMHARA NATIONAL REGIONAL STATE REVENUE AUTHORITY
              </option>
            </select>

            <label
              className="text-dark-eval-2 font-semibold mt-4"
              htmlFor="billId"
            >
              Enter Bill ID:
            </label>
            <div className="flex gap-3 w-full">
              <input
                className="bg-green placeholder-white rounded-md p-3 w-full"
                type="text"
                id="billId"
                placeholder="Enter Bill ID"
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
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
          <p>Due Amount: {responseData.dueAmount || 0}</p>
          <p>Account ID: {responseData.accountID}</p>
          {responseData.extraData && (
            <p>Total Due: {responseData.extraData.TotalDue}</p>
          )}
        </div>
      )}

      {isBillValidated && (
        <AccountValidationForm
          billId={billId}
          totalDue={totalDue}
          accountName={accountName}
          onClear={handleClear}
        />
      )}
    </div>
  );
};

export default BillIdForm;
