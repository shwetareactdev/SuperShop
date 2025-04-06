import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // const res = await axios.get("/api/invoices/all");
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/all`);
                setInvoices(res.data);
            } catch (error) {
                console.error("Error fetching invoices", error);
            }
        };
        fetchInvoices();
    }, []);

    const downloadPDF = async (id) => {
        try {
            // const res = await axios.get(`/api/invoices/generate-pdf/${id}`, { responseType: "blob" });
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/generate-pdf/${id}`, {
                responseType: "blob"
              });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading PDF", error);
        }
    };

    return (
        <div>
            <h2>Invoice List</h2>
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice._id}>
                        {invoice.customerName} - ₹{invoice.totalAmount} 
                        <button onClick={() => downloadPDF(invoice._id)}>Download PDF</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvoiceList;
