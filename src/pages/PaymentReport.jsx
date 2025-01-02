import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import tsedeyLogo from "../assets/images/logo.png";
import watermarkImage from "../assets/images/tsedeylogo.png";

const PAYMENT_TYPES = [
  { id: "Yaya", label: "Yaya Payments" },
  { id: "Sekela", label: "Sekela Payments" },
];

const PaymentReport = () => {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(4);
  const [paymentType, setPaymentType] = useState(PAYMENT_TYPES[0].id);

  // Function to convert number to words
  const convertNumberToWords = (num) => {
    if (num === 0) return "Zero";

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

    const thousands = ["", "Thousand", "Million", "Billion"];

    const convertWholeNumber = (whole) => {
      let words = "";
      let thousandIndex = 0;

      while (whole > 0) {
        const currentChunk = whole % 1000;
        if (currentChunk > 0) {
          const chunkWords = convertChunkToWords(currentChunk);
          words =
            chunkWords +
            (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "") +
            " " +
            words;
        }
        whole = Math.floor(whole / 1000);
        thousandIndex += 1;
      }

      return words.trim();
    };

    const convertChunkToWords = (chunk) => {
      let chunkWords = "";
      if (chunk > 99) {
        chunkWords += ones[Math.floor(chunk / 100)] + " Hundred ";
        chunk %= 100;
      }
      if (chunk > 19) {
        chunkWords += tens[Math.floor(chunk / 10)] + " ";
        chunk %= 10;
      }
      if (chunk > 0) {
        chunkWords += ones[chunk] + " ";
      }
      return chunkWords.trim();
    };

    const [whole, fractional] = num.toString().split(".");
    let words = convertWholeNumber(Number(whole)) + " Birr"; // Update to add "BIRR" here

    if (fractional) {
      const cents = Number(fractional);
      const centsWords = convertWholeNumber(cents);
      words += ` and ${centsWords} Cent${cents !== "1" ? "s" : ""}`;
    }

    return words.trim();
  };

  useEffect(() => {
    const fetchApprovedPayments = async () => {
      const requestBody = {
        Branch_ID: "0101",
        User_ID: paymentType === "Yaya" ? "Dawit" : "Checker",
      };
      let endpoint =
        paymentType === "Yaya"
          ? "http://10.10.105.21:7271/api/Portals/GetReport"
          : "http://10.10.105.21:7271/api/Portals/SekelaGetReport";

      try {
        const response = await axios.post(endpoint, requestBody, {
          headers: { "Content-Type": "application/json" },
        });
        setApprovedPayments(response.data);
        setFilteredPayments(response.data);
      } catch (err) {
        console.error("Error fetching approved payments:", err);
        setError("");
      }
    };

    fetchApprovedPayments();
  }, [paymentType]);

  useEffect(() => {
    const results = approvedPayments.filter((payment) => {
      return (
        payment.amount
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.client_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer_Name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.customer_Account
          ?.toLowerCase()
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
      const logoWidth = 40; // smaller logo width
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
      doc.text("Payment Details", 10, (currentY += 5));
      currentY += 10;

      const paymentDetails =
        paymentType === "Yaya"
          ? [
              { label: "Transaction Ref:", value: payment.tsedey_Reference },
              { label: "YaYa Ref:", value: payment.yaya_Reference },
              { label: "Bill ID:", value: payment.bill_ID },
              { label: "Branch:", value: payment.branch_ID },
              { label: "Debit Account:", value: payment.customer_Account },
              { label: "Account Holder:", value: payment.customer_Name },
              { label: "Credit Account:", value: payment.transfer_To },
              { label: "Client Name:", value: payment.client_Name },
              {
                label: "Amount:",
                value: `${payment.amount} (${convertNumberToWords(
                  payment.amount
                ).toUpperCase()})`,
              }, // Remove "BIRR" from here
            ]
          : [
              { label: "Student ID:", value: payment.student_ID },
              { label: "Transaction Ref:", value: payment.tsedey_Reference },
              { label: "Branch ID:", value: payment.branch_ID },
              { label: "Debit Account:", value: payment.customer_Account },
              { label: "Student Name:", value: payment.student_Name },
              { label: "Account Holder:", value: payment.customer_Name },
              { label: "Months:", value: payment.months },
              { label: "Amounts Per Month:", value: payment.amounts_Per_Month },
              {
                label: "Total Amount:",
                value: `${payment.total_Amount} (${convertNumberToWords(
                  payment.total_Amount
                ).toUpperCase()})`,
              }, // Remove "BIRR" from here
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

      const additionalDetails =
        paymentType === "Yaya"
          ? [
              { label: "Created By:", value: payment.createdBy },
              { label: "Created On:", value: payment.createdOn },
              { label: "Approved By:", value: payment.approvedBy },
              { label: "Approved On:", value: payment.approvedOn },
              { label: "Narration:", value: payment.narration },
            ]
          : [
              { label: "Created By:", value: payment.created_By },
              { label: "Approved By:", value: payment.approved_By },
              { label: "Approved On:", value: payment.approved_On },
              { label: "Narration:", value: payment.narration },
              { label: "Phone:", value: payment.customer_Phone },
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

      doc.save(`Payment_Report_${payment.bill_ID || payment.student_ID}.pdf`);
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

      {/* search and selector */}
      <div className="mt-10 flex justify-between">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-2xl px-4 py-2 bg-cyan placeholder-white"
          />
        </div>

        {/* Payment Type Selector */}
        <div className="">
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

      {filteredPayments.length > 0 ? (
        <table className="min-w-full border border-gray-300 rounded-xl shadow-md overflow-hidden mt-5">
          <thead className="bg-grey-grey-0 text-dark-eval-2">
            <tr>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                {paymentType === "Yaya" ? "Amount" : "Total Amount"}
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                Client Name
              </th>
              <th className="border border-grey-grey-1 p-4 text-left text-sm">
                {paymentType === "Yaya" ? "Customer Name" : "Student Name"}
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
                <td className="border p-4 text-sm">
                  {payment.total_Amount || payment.amount}
                </td>
                <td className="border p-4 text-sm">
                  {payment.client_Name || payment.student_Name}
                </td>
                <td className="border p-4 text-sm">
                  {payment.student_Name || payment.customer_Name}
                </td>
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
