// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";


// const ProfitLoss = () => {
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//       const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProfitLoss = async () => {
//             try {
//                 const response = await axios.get("http://localhost:5000/api/invoices/profit-loss");
//                 setReport(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError("Error fetching data");
//                 setLoading(false);
//             }
//         };
//         fetchProfitLoss();
//     }, []);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p style={{ color: "red" }}>{error}</p>;

//     return (
//         <div style={styles.container} onClick={() => navigate("/profit-loss")}>
//             <h2>📊 Profit & Loss Report</h2>
//             <div style={styles.card}>
//                 <h3>Total Sales: <span style={{ color: "blue" }}>₹{report.totalRevenue}</span></h3>
//                 <h3>Total Cost: <span style={{ color: "orange" }}>₹{report.totalCost}</span></h3>
//                 <h3 
//                     style={{ 
//                         color: report.profitOrLoss >= 0 ? "green" : "red",
//                         fontWeight: "bold"
//                     }}>
//                     {report.status}: ₹{report.profitOrLoss}
//                 </h3>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         textAlign: "center",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif"
//     },
//     card: {
//         border: "2px solid #ddd",
//         borderRadius: "10px",
//         padding: "15px",
//         maxWidth: "300px",
//         margin: "auto",
//         boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
//         backgroundColor: "#f9f9f9"
//     }
// };

// export default ProfitLoss;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfitLoss = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // axios.get("http://localhost:5000/api/invoices/profit-loss")
        axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/profit-loss`)
            .then((res) => {
                setReport(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching data");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.container} onClick={() => navigate("/profit-loss")}>
            <h2>📊 Profit & Loss</h2>
            <div style={styles.card}>
                <p>Total Sales: <span style={styles.blue}>₹{report.totalRevenue}</span></p>
                <p>Total Cost: <span style={styles.orange}>₹{report.totalCost}</span></p>
                <p style={{
                    color: report.profitOrLoss >= 0 ? "green" : "red",
                    fontWeight: "bold"
                }}>
                    {report.status}: ₹{report.profitOrLoss}
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "15px",
        fontFamily: "Arial, sans-serif",
        cursor: "pointer"
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        maxWidth: "250px",
        margin: "auto",
        boxShadow: "1px 1px 6px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
    },
    blue: { color: "blue", fontWeight: "bold" },
    orange: { color: "orange", fontWeight: "bold" }
};

export default ProfitLoss;

