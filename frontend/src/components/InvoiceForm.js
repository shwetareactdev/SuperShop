import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InvoiceForm.css";

const InvoiceForm = () => {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [products, setProducts] = useState([{ productName: "", quantity: 1, price: 0 }]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [invoiceId, setInvoiceId] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(18); // Default GST 18%
    const [subTotal, setSubTotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null); // सध्या कोणत्या इनपुटवर टाइप होतेय ते स्टोअर करायला
    const firmName = "Super Shoppy";
    const firmAddress = "123, Main Street, City, State - 123456";

    useEffect(() => {
        // axios.get("http://localhost:5000/api/products/available")
        axios.get(`${process.env.REACT_APP_API_URL}/api/products/available`)
            .then(res => setAvailableProducts(res.data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    // const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/search?q=${query}`);
                    setSuggestions(res.data.length > 0 ? res.data : [{ name: "Not available in our store" }]);
                } catch (err) {
                    console.error("Error fetching suggestions:", err);
                }
            };
            const timer = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [query]);


    const addProduct = () => {
        setProducts([...products, { productName: "", quantity: 1, price: 0 }]);
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];

        if (field === "productName") {
            const selectedProduct = availableProducts.find(p => p.name === value);
            if (selectedProduct) {
                updatedProducts[index] = {
                    productName: value,
                    quantity: 1,
                    unit: selectedProduct.unit || "Pcs",
                    price: selectedProduct.price
                };
                setSuggestions([]); // 🔹 सिलेक्ट केल्यावर सग्गेशन गायब कर
                setActiveIndex(null); // 🔹 अॅक्टिव्ह इनपुट क्लिअर कर
            } else {
                updatedProducts[index][field] = value;
            }
        } else {
            updatedProducts[index][field] = value;
        }

        setProducts(updatedProducts);
        setQuery(value);
    };

    // 🔹 फक्त सध्याच्या टाइप होत असलेल्या इनपुटवर सग्गेशन दिसेल
    const handleFocus = (index) => {
        setActiveIndex(index);
    };

    // 🔹 जेव्हा युजर बाहेर क्लिक करेल तेव्हा सग्गेशन गायब होईल
    const handleBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
            setActiveIndex(null);
        }, 200);
    };



    useEffect(() => {
        const subTotalCalc = products.reduce((total, product) => total + product.quantity * product.price, 0);
        const taxCalc = (subTotalCalc * taxPercentage) / 100;
        setSubTotal(subTotalCalc);
        setTaxAmount(taxCalc);
        setTotalAmount(subTotalCalc + taxCalc);
    }, [products, taxPercentage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validProducts = products.filter(p =>
            availableProducts.some(ap => ap.name === p.productName) && p.quantity > 0 && p.price > 0
        );


        if (validProducts.length === 0) {
            alert("कमीत कमी एक वैध प्रॉडक्ट निवडा!");
            return;
        }

        const invoiceData = {
            invoiceNumber: `INV-${Date.now()}`,
            firmName: "My Business",
            firmAddress: "Kolhapur, Maharashtra",
            customerName,
            customerPhone,
            products: validProducts.map((p) => ({ ...p, total: p.quantity * p.price })),
            subTotal: Number(subTotal) || 0,  // ✅ NaN टाळण्यासाठी
            taxPercentage: Number(taxPercentage) || 0,  // ✅ NaN टाळण्यासाठी
            taxAmount: Number(taxAmount) || 0,  // ✅ NaN टाळण्यासाठी
            totalAmount: Number(totalAmount) || 0,  // ✅ NaN टाळण्यासाठी
            paymentMethod,
            invoiceDate: new Date(),
        };

        console.log("📤 Sending Invoice Data:", invoiceData); // ✅ Debugging
        console.log("🔍 Subtotal:", subTotal);
        console.log("🔍 Tax Percentage:", taxPercentage);
        console.log("🔍 Tax Amount:", taxAmount);
        console.log("🔍 Total Amount:", totalAmount);

        try {
            // const res = await axios.post("http://localhost:5000/api/invoices/create", invoiceData, {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/invoices/create`, invoiceData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("✅ Invoice Created:", res.data);
            alert("Invoice Created Successfully!");
            setInvoiceId(res.data.invoice._id);

            // ✅ Updated stock values
            if (res.data.updatedProducts) {
                console.log("📢 Updated Products:", res.data.updatedProducts);

                // ✅ स्टॉक अपडेट करतो Dashboard वर
                setProducts((prevProducts) =>
                    prevProducts.map((product) => {
                        const updated = res.data.updatedProducts.find((p) => p.name === product.name);
                        return updated ? { ...product, quantity: updated.newStock } : product;
                    })
                );
            }
        } catch (error) {
            console.error("❌ Error creating invoice:", error.response?.data || error.message);
            alert("Failed to create invoice.");
        }
    };


    return (
        <div className="invoice-container">
            <h2>{firmName}</h2>
            <p>{firmAddress}</p>
            <h3>Create Invoice</h3>
            <form onSubmit={handleSubmit}>
                <label>Customer Name:</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

                <label>Phone Number:</label>
                <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />

                <h3>Products</h3>
                {products.map((product, index) => (
                    <div key={index} className="product-row">
                        <input
                            type="text"
                            placeholder="Enter product name..."
                            value={product.productName}
                            onChange={(e) => handleProductChange(index, "productName", e.target.value)}
                            onFocus={() => handleFocus(index)} // 🔹 टाइप होत असलेल्या इनपुटसाठीच suggestions दाखवा
                            onBlur={handleBlur}
                        />

                        {activeIndex === index && suggestions.length > 0 && ( // 🔹 फक्त सध्याच्या इनपुटसाठी सग्गेशन दाखवा
                            <ul className="suggestions-list">
                                {suggestions.map((p, i) => (
                                    <li key={i} onClick={() => handleProductChange(index, "productName", p.name)}>
                                        {p.name} (Category:{p.category}), (Available Stock:{p.quantity} {p.unit})
                                    </li>
                                ))}
                            </ul>
                        )}

                        <input type="number" placeholder="Quantity" value={product.quantity} onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))} required />
                        <input type="text" placeholder="Unit (e.g., Kg, Ltr, Pcs)" value={product.unit || ""} onChange={(e) => handleProductChange(index, "unit", e.target.value)} required />
                        <input type="number" placeholder="Price" value={product.price} readOnly required />
                    </div>
                ))}
                <button type="button" onClick={addProduct}>+ Add Product</button>


                <h3>Subtotal: ₹{subTotal}</h3>
                <h3>Tax ({taxPercentage}%): ₹{taxAmount}</h3>
                <h3>Total Amount: ₹{totalAmount}</h3>

                <label>Payment Method:</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                </select>

                <button type="submit">Generate Invoice</button>

                {/* {invoiceId && (
                    <button onClick={() => window.open(`/api/invoices/download/${invoiceId}`, "_blank")} style={{ marginTop: "10px", backgroundColor: "green", color: "white", padding: "10px" }}>
                        Download Invoice PDF
                    </button>
                )} */}
                {invoiceId && (
  <button
    onClick={() =>
      //  window.open(`http://localhost:5000/api/invoices/download/${invoiceId}`, "_blank")
      window.open(`${process.env.REACT_APP_API_URL}/api/invoices/download/${invoiceId}`, "_blank")
    }
    style={{
        backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px"
    }}
  >
    ⬇️ Download PDF
  </button>
)}



            </form>
        </div>
    );
};

export default InvoiceForm;
