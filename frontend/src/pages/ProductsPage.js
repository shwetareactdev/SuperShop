// ✅ Features:
// 1️⃣ Product List (API मधून डेटा आणतो)
// 2️⃣ Search Functionality (Name आणि Category वर आधारित)
// 3️⃣ Inline Editing (Table मध्ये Edit करू शकतो)
// 4️⃣ Delete Functionality (Confirm Delete Popup)
// 5️⃣ Add Product Button (Product Add करण्यासाठी लिंक)

import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search State

    // ✅ API Call - Get All Products
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ Handle Edit Button Click
    const handleEdit = (product) => {
        setEditProduct(product);
    };

    // ✅ Handle Save Button (Update API Call)
    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/update/${editProduct._id}`, editProduct);
            setEditProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    // ✅ Handle Delete Product
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    // 🔍 **Filter Products based on Search Term**
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: "20px" }}>
            {/* Header with Add Product Button & Title */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Manage Products</h2>
                <a href="productForm">
                    <button style={{ padding: "8px 15px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
                        + Add New Product
                    </button>
                </a>
            </div>

            {/* 🔍 Search Bar with `✖` Button */}
            <div style={{ margin: "10px 0", position: "relative", display: "inline-block" }}>
                <input
                    type="text"
                    placeholder="Search by Name or Category"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "300px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        paddingRight: "30px",
                    }}
                />
                {searchTerm && (
                    <span
                        onClick={() => setSearchTerm("")}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#888",
                        }}
                    >
                        ✖
                    </span>
                )}
            </div>

            <table border="1" style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f2f2f2" }}>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                      
                        <th>Cost Price</th>  {/* ✅ Cost Price Header */}
                        <th>Selling Price</th>
                        <th>Image URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product._id}>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="text"
                                        value={editProduct.name}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, name: e.target.value })
                                        }
                                    />
                                ) : (
                                    product.name
                                )}
                            </td>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="text"
                                        value={editProduct.category}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, category: e.target.value })
                                        }
                                    />
                                ) : (
                                    product.category
                                )}
                            </td>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="number"
                                        value={editProduct.quantity}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, quantity: e.target.value })
                                        }
                                    />
                                ) : (
                                    product.quantity
                                )}
                            </td>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="text"
                                        value={editProduct.unit}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, unit: e.target.value })
                                        }
                                    />
                                ) : (
                                    product.unit
                                )}
                            </td>
                            
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="number"
                                        value={editProduct.costPrice}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, costPrice: e.target.value })
                                        }
                                    />
                                ) : (
                                    `₹${product.costPrice}`
                                )}
                            </td>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="number"
                                        value={editProduct.price}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, price: e.target.value })
                                        }
                                    />
                                ) : (
                                    `₹${product.price}`
                                )}
                            </td>



                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <input
                                        type="text"
                                        value={editProduct.image}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, image: e.target.value })
                                        }
                                    />
                                ) : (
                                    <img src={product.image} alt={product.name} width="50" />
                                )}
                            </td>
                            <td>
                                {editProduct && editProduct._id === product._id ? (
                                    <>
                                        <button onClick={handleSaveEdit} style={{ marginRight: "5px" ,fontSize:"15px"}}>Save</button>
                                        <button onClick={() => setEditProduct(null)} style={{fontSize:"15px"}}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                     <center>   <button onClick={() => handleEdit(product)} style={{ marginRight: "5px",fontSize:"15px" }}>Edit</button>
                                     <button onClick={() => handleDelete(product._id)} style={{ background: "red", color: "#fff", border: "none" ,fontSize:"15px"}}>Delete</button></center>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
