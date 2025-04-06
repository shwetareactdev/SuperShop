import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Stats/ProductStats.css";

const ProductStats = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // const productRes = await axios.get("http://localhost:5000/api/products/count");
                const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/count`);
                setTotalProducts(productRes.data.total);

                // const invoiceRes = await axios.get("http://localhost:5000/api/invoices/count");
                const invoiceRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/count`);
                setTotalInvoices(invoiceRes.data.total);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="stats-container">
            <div className="stats-card" onClick={() => navigate("/products")}>
                <h3>Total Products</h3>
                <p>{totalProducts}</p>
            </div>
            <div className="stats-card" onClick={() => navigate("/invoices")}>
                <h3>Total Invoices</h3>
                <p>{totalInvoices}</p>
            </div>
        </div>
    );
};

export default ProductStats;
