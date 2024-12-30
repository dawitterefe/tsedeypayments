import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import tsedeyLogo from "../assets/images/logo.png";
import watermarkImage from "../assets/images/tsedeylogo.png";

const PaymentReport = () => {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 4;

  // Function to convert number to words
  const convertNumberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 === 0 ? "" : " " + ones[num % 10])
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 === 0 ? "" : " " + convertNumberToWords(num % 100))
      );

    return num; // Return the original number if it's 1000 or more (you can expand this as needed)
  };

  useEffect(() => {
    const fetchApprovedPayments = async () => {
      const requestBody = { Branch_ID: "0101", User_ID: "Dawit" };
      try {
        const response = await axios.post(
          "http://10.10.105.21:7271/api/Portals/GetReport",
          requestBody,
          { headers: { "Content-Type": "application/json" } }
        );
        setApprovedPayments(response.data);
        setFilteredPayments(response.data);
      } catch (err) {
        console.error("Error fetching approved payments:", err);
        setError("");
      }
    };

    fetchApprovedPayments();
  }, []);

  useEffect(() => {
    const results = approvedPayments.filter((payment) => {
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
    setCurrentPage(0);
  }, [searchTerm, approvedPayments]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  const generatePDF = async (payment) => {
    const doc = new jsPDF("p", "mm", "a4");

    try {
      const mainLogo = await loadImage(tsedeyLogo);
      const watermark = await loadImage(watermarkImage);

      // Logo
      const logoWidth = 40; // Smaller logo
      const logoHeight = (mainLogo.height / mainLogo.width) * logoWidth;
      doc.addImage(mainLogo, "PNG", 10, 10, logoWidth, logoHeight);

      // Date
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 20);
      doc.line(10, 30, 200, 30); // Line separator

      let currentY = 35; // Start below the line

      // Payment Details Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      currentY += 5;
      doc.text("Payment Details", 10, currentY);
      currentY += 10;

      doc.setFont("Helvetica", "normal");
      const paymentDetails = [
        { label: "Transaction Ref:", value: payment.tsedey_Reference },
        { label: "YaYa Ref:", value: payment.yaya_Reference },
        { label: "Branch:", value: payment.branch_ID },
        { label: "Debit Account:", value: payment.customer_Account },
        { label: "Account Holder:", value: payment.customer_Name },
        { label: "Credit Account:", value: payment.transfer_To },
        { label: "Client Name:", value: payment.client_Name },
        {
          label: "Amount:",
          value: `${payment.amount} (${convertNumberToWords(
            payment.amount
          ).toUpperCase()} BIRR)`,
        },
      ];

      // Draw payment details as a compact table
      let lineHeight = 7; // Smaller line height for compactness
      paymentDetails.forEach(({ label, value }, index) => {
        const lineY = currentY + index * lineHeight;
        doc.text(label, 10, lineY);
        doc.text(value, 60, lineY); // Align value on the right
      });
      currentY += paymentDetails.length * lineHeight + 8; // Update currentY for additional information

      // Additional Information Header
      doc.setFont("Helvetica", "bold");
      doc.text("Additional Information", 10, currentY);
      currentY += 8;

      const additionalDetails = [
        { label: "Created By:", value: payment.createdBy },
        { label: "Created On:", value: payment.createdOn },
        { label: "Approved By:", value: payment.approvedBy },
        { label: "Approved On:", value: payment.approvedOn },
        { label: "Narration:", value: payment.narration },
      ];

      doc.setFont("Helvetica", "normal");
      additionalDetails.forEach(({ label, value }, index) => {
        const lineY = currentY + index * lineHeight;
        doc.text(label, 10, lineY);
        doc.text(value, 60, lineY); // Align value on the right
      });
      currentY += additionalDetails.length * lineHeight + 1; // Add space after details

      // Watermark
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaledWidth = 260; // Adjusted size
      const scaledHeight = 260;
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      ctx.globalAlpha = 0.05; // Very subtle
      ctx.drawImage(watermark, 0, 0, scaledWidth, scaledHeight);
      const watermarkDataUrl = canvas.toDataURL("image/png");
      const watermarkX = (doc.internal.pageSize.getWidth() - scaledWidth) / 2;
      const belowTextY = currentY + 5;

      // Add watermark image to PDF
      doc.addImage(
        watermarkDataUrl,
        "PNG",
        watermarkX,
        belowTextY,
        scaledWidth,
        scaledHeight
      );

      doc.save(`Payment_Report_${payment.bill_ID}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate the PDF.");
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredPayments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold text-dark-eval-3">Approved Payments</h2>
      {error && <p className="error text-red">{error}</p>}

      <div className="flex justify-start mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-2xl px-4 py-2 bg-cyan placeholder-white"
        />
      </div>

      {filteredPayments.length > 0 ? (
        <table className="min-w-full border border-gray-300 rounded-xl shadow-md overflow-hidden mt-5">
          <thead className="bg-grey-grey-0 text-dark-eval-2">
            <tr>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                Amount
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                Client Name
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                Customer Name
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                Customer Account
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
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
                <td className="border p-4 text-sm">{payment.amount}</td>
                <td className="border p-4 text-sm">{payment.client_Name}</td>
                <td className="border p-4 text-sm">{payment.customer_Name}</td>
                <td className="border p-4 text-sm">
                  {payment.customer_Account}
                </td>
                <td className="border p-4 text-sm">
                  <button
                    onClick={() => generatePDF(payment)}
                    className="bg-blue text-white text-sm px-2 py-1 rounded hover:bg-blue/50 transition"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved payments available.</p>
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

export default PaymentReport;
