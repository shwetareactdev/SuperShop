import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const StockUpdate = () => {
    const [products, setProducts] = useState([]);
    const [stockUpdates, setStockUpdates] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products");
                console.log("📡 Products Data:", res.data);
                setProducts(res.data.products || []);
            } catch (error) {
                console.error("❌ Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        socket.on("stockUpdated", (updatedProducts) => {
            console.log("📢 Stock Updated:", updatedProducts);
            if (Array.isArray(updatedProducts)) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) => {
                        const updated = updatedProducts.find((p) => p.name === product.name);
                        return updated ? { ...product, quantity: updated.newStock } : product;
                    })
                );
                setStockUpdates(updatedProducts);
            }
        });

        return () => socket.off("stockUpdated");
    }, []);

    return (
        <div className="stock-update-container">
            <h1>Stock Updates</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.name}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">No products available</td></tr>
                    )}
                </tbody>
            </table>

            {Array.isArray(stockUpdates) && stockUpdates.length > 0 && (
                <div>
                    <h4>Updated Stock:</h4>
                    <ul>
                        {stockUpdates.map((product, index) => (
                            <li key={index}>{product.name}: {product.newStock} units</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StockUpdate;
