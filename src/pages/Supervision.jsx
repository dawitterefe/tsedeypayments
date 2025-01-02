import React, { useEffect, useState } from "react";
import axios from "axios";

// List of available payment types. This could also come from an API.
const PAYMENT_TYPES = [
  { id: "Yaya", label: "Yaya Pending Payments" },
  { id: "Sekela", label: "Sekela Pending Payments" },
  // Add additional payment types here as needed
];

const PaymentSupervision = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0].id);
  const rowsPerPage = 4; // Number of rows per page

  const fetchPendingPayments = async () => {
    const branchID = "0101";
    const userID = paymentType === "Yaya" ? "Dawit" : "test";
    const requestBody = { BranchID: branchID, User_ID: userID };

    let endpoint;
    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/Portals/AccessPandingPayment";
    } else if (paymentType === "Sekela") {
      endpoint =
        "http://10.10.105.21:7271/api/Portals/AccessSekelaPendingPayment";
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);
    setError(null); // Reset error

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Fetched payments:", response.data);
      setPendingPayments(response.data);
      setFilteredPayments(response.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to fetch payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, [paymentType]);

  useEffect(() => {
    const results = pendingPayments.filter((payment) => {
      return (
        (payment.total_Amount &&
          payment.total_Amount
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (payment.client_Name &&
          payment.client_Name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (payment.student_Name &&
          payment.student_Name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (payment.customer_Account &&
          payment.customer_Account
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredPayments(results);
    setCurrentPage(0);
  }, [searchTerm, pendingPayments]);

  const handleApprove = async (payment) => {
    let requestBody;

    if (paymentType === "Yaya") {
      requestBody = {
        CustomerID: "Dawit",
        Country: "ETHIOPIATEST",
        BankID: "02",
        UniqueID: payment.customer_Account,
        FunctionName: "GETNAME",
        ISOFieldsRequest: null,
        ISOFieldsResponse: null,
        PaymentDetails: {
          MerchantID: "YAYAPAYMENT",
          FunctionName: "GETNAME",
          AccountID: payment.client_yaya_account,
          Amount: payment.amount.toString(),
          ReferenceNumber: "aba47c60-e606-11ee-b720-f51215b66fffyuyuxx",
        },
        InfoFields: {
          InfoField1: payment.bill_ID,
          InfoField2: payment.customer_Phone_Number,
          InfoField3: payment.customer_Name,
          InfoField7: payment.customer_Account,
          InfoField15: payment.transfer_To,
          InfoField16: payment.narration,
          InfoField17: payment.branch_ID,
          InfoField18: payment.createdOn.toString(),
          InfoField19: "Checker",
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
          IMEI: null,
          IMSI: null,
          AppNotificationID: null,
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
    } else if (paymentType === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Total_Amount: payment.total_Amount,
        Customer_Account: payment.customer_Account,
        To_Account: payment.to_Account,
        Branch_ID: payment.branch_ID,
        Created_By: "Checker",
        Created_On: payment.created_On,
        Narration: payment.narration,
        Transaction_ID: payment.transaction_ID,
      };
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);

    let endpoint;

    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/YAYA/B2YaYa";
    } else if (paymentType === "Sekela") {
      endpoint = "http://10.10.105.21:7271/api/Portals/B2Sekela";
    } else {
      return; // Exit if no valid payment type is found
    }

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.status !== "200") {
        setError(response.data?.message);
      } else if (response.data?.status === "200") {
        setSuccessMessage("Payment approved successfully!");
        // Refresh the pending payments list after approval
        await fetchPendingPayments();
      }
    } catch (err) {
      console.error("Error approving payment:", err);
      setError(err.response?.data?.message || "Failed to approve payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (payment) => {
    let requestBody;

    if (paymentType === "Yaya") {
      requestBody = {
        Bill_ID: payment.bill_ID,
        Customer_Account: payment.customer_Account,
        Client_yaya_account: payment.client_yaya_account,
        Branch_ID: payment.branch_ID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: "Rejecter",
      };
    } else if (paymentType === "Sekela") {
      requestBody = {
        Student_ID: payment.student_ID,
        Customer_Account: payment.customer_Account,
        To_Account: payment.to_Account,
        Branch_ID: payment.branch_ID,
        RejectedON: new Date().toLocaleString(),
        RejectedBy: "Rejecter",
      };
    } else {
      return; // Exit if no valid payment type is found
    }

    setIsLoading(true);

    let endpoint;

    if (paymentType === "Yaya") {
      endpoint = "http://10.10.105.21:7271/api/Portals/RejectPayement";
    } else if (paymentType === "Sekela") {
      endpoint = "http://10.10.105.21:7271/api/Portals/RejectSekelaPayement";
    } else {
      return; // Exit if no valid payment type is found
    }

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data?.status !== "200") {
        setError(response.data?.message);
      } else if (response.data?.status === "200") {
        setSuccessMessage("Payment Rejected successfully!");
        // Refresh the pending payments list after rejection
        await fetchPendingPayments();
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      setError(err.response?.data?.message || "Failed to reject payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredPayments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-eval-2">Pending Payments</h2>
      <div className="container">
        {error && (
          <p className="error text-red text-lg font-bold italic">{error}</p>
        )}
        {successMessage && (
          <p className="success text-xl font-bold italic text-green1">
            {successMessage}
          </p>
        )}
      </div>
      {/* search and selector */}
      <div className="flex justify-between mt-10">
        {/* Search input */}
        <div className="flex justify-start mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-2xl px-4 py-2 bg-cyan placeholder-white"
          />
        </div>

        {/* Payment Type Selector */}
        <div className="mb-4">
          <label htmlFor="payment-type" className="mr-2">
            Select Payment Type:
          </label>
          <select
            id="payment-type"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="border rounded-2xl px-4 py-2"
          >
            {PAYMENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner"></div> {/* Spinner component here */}
        </div>
      ) : (
        <>
          {currentRows.length > 0 ? (
            <table className="min-w-full border border-gray-300 rounded-xl shadow-md overflow-hidden mt-5">
              <thead className="bg-grey-grey-0 text-dark-eval-1">
                <tr>
                  <th className="border border-grey-grey-1 p-4 text-left">
                    {paymentType === "Yaya" ? "Amount" : "Total Amount"}
                  </th>
                  <th className="border border-grey-grey-1 p-4 text-left">
                    Client/Customer Name
                  </th>
                  <th className="border border-grey-grey-1 p-4 text-left">
                    {paymentType === "Yaya" ? "Customer Name" : "Student Name"}
                  </th>
                  <th className="border border-grey-grey-1 p-4 text-left">
                    Customer Account
                  </th>
                  <th className="border border-grey-grey-1 p-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-cyan">
                {currentRows.map((payment) => (
                  <tr
                    key={payment.rowID}
                    className="hover:bg-cyan/50 transition-colors"
                  >
                    <td className="border">
                      {payment.total_Amount || payment.amount}
                    </td>
                    <td className="border p-4 text-sm tet-left">
                      {payment.client_Name || payment.student_Name}
                    </td>
                    <td className="border px-4 py-2 text-sm text-left">
                      {payment.student_Name || payment.customer_Name}
                    </td>
                    <td className="border p-4">{payment.customer_Account}</td>
                    <td className="border p-4 ">
                      <div className="flex flex-row items-center gap-3">
                        <button
                          onClick={() => handleApprove(payment)}
                          className={`bg-green1 text-white text-sm px-2 py-2 rounded hover:bg-green1 transition ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(payment)}
                          className={`bg-red text-white px-2 py-2 text-sm rounded hover:bg-red transition ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg font-bold text-gray-500 mt-5 text-dark-dark">
              No pending payments available.
            </p>
          )}
        </>
      )}

      {/* Only render pagination if there are current rows */}
      {currentRows.length > 0 && (
        <div className="mt-5 flex justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {currentRows.length > 0 && (
        <div className="mt-5 text-center text-dark-eval-3">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default PaymentSupervision;
