import React, { useState } from "react";
import axios from "axios";
import PaymentSavingForm from "./PaymentSavingForm"; // Import PaymentSavingForm

const AccountValidationForm = ({
  studentId,
  totalOutstandingFee,
  studentFullName,
  transactionId,
  months, // Receive months as an array
  amounts, // Receive amounts as an array
  grade,
  school,
  onClear,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountResponse, setAccountResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAccountSubmit = async (e) => {
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
        AccountID: accountNumber,
        Amount: "0",
        ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
      },
      InfoFields: {
        InfoField1: "",
        InfoField7: accountNumber,
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
        "http://10.10.105.21:7271/api/YAYA/GetCustomerDetail",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Account Validation Response:", response.data);
      setAccountResponse(response.data);
      setError(null);
      setAccountNumber("");
    } catch (err) {
      console.error("Error Details: ", err);
      setError("An error occurred while validating the account number.");
      setAccountResponse(null);
    }
  };

  const handleClear = () => {
    setAccountNumber("");
    setAccountResponse(null);
    setError(null);
    onClear(); // Call clear function passed from parent
  };

  const canShowPaymentSavingForm =
    accountResponse &&
    accountResponse.status === "200" &&
    parseFloat(accountResponse.extraData?.AvailableBalance) > 0;

  return (
    <div>
      {accountResponse ? null : (
        <form onSubmit={handleAccountSubmit} className="w-full max-w-lg p-5">
          <div className="flex flex-col gap-5">
            <label
              className="text-gray-800 font-semibold"
              htmlFor="accountNumber"
            >
              Please Enter The Account Number:
            </label>
            <div className="flex gap-3 w-full">
              <input
                className="bg-green text-white placeholder-white rounded-md p-3 w-full"
                type="text"
                id="accountNumber"
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-3 w-32"
              >
                Validate Account
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
      )}
      {error && <p className="error">{error}</p>}
      {accountResponse && (
        <div className="text-left text-md font-bold mt-5 text-dark-eval-1">
          <p>Customer Name: {accountResponse.extraData["Customer Name"]}</p>
          <p>Account Number: {accountResponse.extraData["Account Number"]}</p>
          <p>Phone Number: {accountResponse.extraData["Phone Number"]}</p>
          <p>
            Available Balance: {accountResponse.extraData["AvailableBalance"]}
          </p>
        </div>
      )}
      {canShowPaymentSavingForm && (
        <PaymentSavingForm
          paymentDetails={{
            studentId,
            totalOutstandingFee,
            accountNumber: accountResponse.extraData["Account Number"],
            customerName: accountResponse.extraData["Customer Name"],
            studentFullName,
            phoneNumber: accountResponse.extraData["Phone Number"],
            transactionId,
            months, 
            amounts, 
            grade, 
            school, 
          }}
          onClear={handleClear}
        />
      )}
    </div>
  );
};

export default AccountValidationForm;
