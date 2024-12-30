import React, { useEffect, useState } from "react";
import axios from "axios";

const Supervision = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [requestBody, setRequestBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 4; // Number of rows per page

  useEffect(() => {
    const fetchPendingPayments = async () => {
      const branchID = "0101";
      const requestBody = { BranchID: branchID, User_ID: "Dawit" };

      try {
        const response = await axios.post(
          "http://10.10.105.21:7271/api/Portals/AccessPandingPayment",
          requestBody,
          { headers: { "Content-Type": "application/json" } }
        );
        setPendingPayments(response.data);
        setFilteredPayments(response.data); // Initialize filteredPayments with all data
      } catch (err) {
        console.error("Error fetching pending payments:", err);
        setError("");
      }
    };

    fetchPendingPayments();
  }, []);

  // Filter the pending payments based on the search term
  useEffect(() => {
    const results = pendingPayments.filter((payment) => {
      return (
        payment.amount
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.client_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_Name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.customer_Account
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPayments(results);
    setCurrentPage(0); // Reset to the first page whenever the search changes
  }, [searchTerm, pendingPayments]);

  const handleApprove = async (payment) => {
    const requestBody = {
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
        InfoField19: "CHECKER",
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

    // Update the request body state to display in UI
    setRequestBody(JSON.stringify(requestBody, null, 2));

    // Set loading state to true
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/YAYA/B2YaYa",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      // Only proceed if the response status is 200
      if (response.status === 200) {
        setPendingPayments((prevPayments) =>
          prevPayments.filter((p) => p.rowID !== payment.rowID)
        );
        setSuccessMessage("Payment approved successfully!");

        // Automatically hide success message after 7 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 7000);
      } else {
        setError(
          response.data.message ||
            "Failed to approve payment. Please try again."
        );
      }
    } catch (err) {
      console.error("Error approving payment:", err);
      setError(err.response?.data?.message || "Failed to approve payment.");

      // Automatically hide error message after 7 seconds
      setTimeout(() => {
        setError(null);
      }, 7000);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  const handleReject = async (payment) => {
    const requestBody = {
      Bill_ID: payment.bill_ID,
      Customer_Account: payment.customer_Account,
      Client_yaya_account: payment.client_yaya_account,
      Branch_ID: payment.branch_ID,
      RejectedON: payment.createdOn.toString(),
      RejectedBy: "Rejecter",
    };

    setIsLoading(true);
    setRequestBody(JSON.stringify(requestBody, null, 2));

    try {
      const response = await axios.post(
        "http://10.10.105.21:7271/api/Portals/RejectPayement",
        requestBody,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setPendingPayments((prevPayments) =>
          prevPayments.filter((p) => p.rowID !== payment.rowID)
        );
        setSuccessMessage("Payment rejected successfully!");

        // Automatically hide success message after 7 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 7000);
      } else {
        setError(
          response.data.message || "Failed to reject payment. Please try again."
        );
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      setError(err.response?.data?.message || "Failed to reject payment.");

      // Automatically hide error message after 7 seconds
      setTimeout(() => {
        setError(null);
      }, 7000);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination Logic
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredPayments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-eval-2">Pending Payments</h2>
      {error && <p className="error text-red">{error}</p>}
      {successMessage && (
        <p className="success text-xl font-bold italic text-green1">
          {successMessage}
        </p>
      )}

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

      {currentRows.length > 0 ? (
        <table className="min-w-full border border-gray-300 rounded-xl shadow-md overflow-hidden mt-5">
          <thead className="bg-grey-grey-0 text-dark-eval-1">
            <tr>
              <th className="border border-grey-grey-1 p-4 text-left">
                Amount
              </th>
              <th className="border border-grey-grey-1 p-4 text-left">
                Client Name
              </th>
              <th className="border border-grey-grey-1 p-4 text-left">
                Customer Name
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
                <td className="border">{payment.amount}</td>
                <td className="border  p-4 text-sm tet-left">
                  {payment.client_Name}
                </td>
                <td className="border px-4 py-2 text-sm text-left">
                  {payment.customer_Name}
                </td>
                <td className="border p-4">{payment.customer_Account}</td>
                <td className="border p-4 ">
                  <div className="flex flex-row items-center gap-3">
                    <div>
                      <button
                        onClick={() => handleApprove(payment)}
                        className={`bg-green1 text-white text-sm px-2 py-2 rounded hover:bg-green1 transition ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Approve"}
                      </button>
                    </div>

                    <div>
                      {" "}
                      <button
                        onClick={() => handleReject(payment)}
                        className={`bg-red text-white px-2 py-2  text-sm rounded hover:bg-red transition ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Reject"}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending payments available.</p>
      )}

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

      <div className="mt-5 text-center text-dark-eval-3">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
};

export default Supervision;
