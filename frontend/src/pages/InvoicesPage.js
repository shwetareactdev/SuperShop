import React, { useEffect, useState } from "react";
import axios from "axios";

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // const res = await axios.get("http://localhost:5000/api/invoices");
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices`);
                console.log("✅ Fetched Invoices:", res.data);
                setInvoices(res.data);
            } catch (error) {
                console.error("❌ Error fetching invoices:", error);
                setError("Failed to load invoices.");
                setInvoices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // 🔍 Filter Logic
    const filteredInvoices = invoices.filter((invoice) => 
        invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber?.toString().includes(searchTerm) ||
        invoice.customerPhone?.includes(searchTerm)
    );

    return (
        <div style={invoiceStyles.container}>
            <h2 style={invoiceStyles.title}>📜 Invoices</h2>

            {/* 🔍 Search Bar */}
            <input
                type="text"
                placeholder="Search by Name, Invoice No, or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={invoiceStyles.searchBar}
            />

            {loading ? (
                <p>Loading invoices...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : filteredInvoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                filteredInvoices.map((invoice) => (
                    <div key={invoice._id} style={invoiceStyles.invoiceBox}>
                        <div style={invoiceStyles.header}>
                            <div style={invoiceStyles.leftSection}>
                                <h3 style={invoiceStyles.firmName}>Super Shoppy Pvt Ltd</h3>
                                <p>123, Main Street, Kolhapur</p>
                                <p>Email: shwetareactdev@gmail.com</p>
                                <p>Phone: 95610 94572</p>
                            </div>
                            <div style={invoiceStyles.rightSection}>
                                <p><strong>Invoice No:</strong> {invoice.invoiceNumber || "N/A"}</p>
                                <p><strong>Customer:</strong> {invoice.customerName || "Unknown"}</p>
                                <p><strong>Phone:</strong> {invoice.customerPhone || "N/A"}</p>
                                <p><strong>Payment Method:</strong> {invoice.paymentMethod || "N/A"}</p>
                            </div>
                        </div>

                        <p style={invoiceStyles.date}><strong>Date:</strong> {invoice.invoiceDate || "N/A"}</p>

                        <table style={invoiceStyles.table}>
                            <thead>
                                <tr>
                                    <th style={invoiceStyles.th}>Product Name</th>
                                    <th style={invoiceStyles.th}>Quantity</th>
                                    <th style={invoiceStyles.th}>Unit</th>
                                    <th style={invoiceStyles.th}>Price (₹)</th>
                                    <th style={invoiceStyles.th}>Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.products?.map((product, index) => (
                                    <tr key={index}>
                                        <td style={invoiceStyles.td}>{product.productName || "N/A"}</td>
                                        <td style={invoiceStyles.td}>{product.quantity || 0}</td>
                                        <td style={invoiceStyles.td}>{product.unit || "N/A"}</td>
                                        <td style={invoiceStyles.td}>₹{product.price || 0}</td>
                                        <td style={invoiceStyles.td}>₹{product.total || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={invoiceStyles.pricing}>
                            <p><strong>Subtotal:</strong> ₹{invoice.subTotal || 0}</p>
                            <p><strong>Tax ({invoice.taxPercentage || 0}%):</strong> ₹{invoice.taxAmount || 0}</p>
                            <p><strong>Total Amount:</strong> ₹{invoice.totalAmount || 0}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// ✅ CSS Styles
const invoiceStyles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif" },
    title: { textAlign: "center", marginBottom: "20px" },
    searchBar: { 
        width: "400px", padding: "8px", marginBottom: "20px", fontSize: "16px",
        border: "1px solid #ccc", borderRadius: "5px"
    },
    invoiceBox: { border: "1px solid black", padding: "15px", borderRadius: "5px", marginBottom: "20px", background: "#fff" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
    leftSection: { textAlign: "left" },
    firmName: { fontSize: "18px", fontWeight: "bold" },
    rightSection: { textAlign: "right" },
    date: { textAlign: "right", fontWeight: "bold", marginBottom: "10px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: { background: "#f2f2f2", padding: "8px", textAlign: "left", borderBottom: "2px solid #ddd" },
    td: { padding: "8px", borderBottom: "1px solid #ddd" },
    pricing: { textAlign: "right", marginTop: "10px", fontWeight: "bold" },
};

export default Invoices;
