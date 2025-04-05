import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/ProductForm.css";
const ProductForm = () => {
    const [product, setProduct] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        price: "",
        costPrice: "",  // 🆕 Add this field
        image: ""
    });

    const [categories, setCategories] = useState([]); // Categories State

    // ✅ Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products/categories");
                if (response.data.length > 0) {
                    console.log("Fetched Categories:", response.data); // ✅ Debugging
                    setCategories(response.data);
                } else {
                    console.warn("No categories found");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // ✅ Handle input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // ✅ Fix: Handle category selection explicitly
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value.trim(); // ✅ Remove spaces
        console.log("Category Selected:", selectedCategory);
        setProduct({ ...product, category: selectedCategory });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalCategory = product.category;

        // ✅ Fix: If 'Other' is selected, save new category
        if (product.category === "other" && product.newCategory) {
            finalCategory = product.newCategory.trim();
        }

        console.log("Final Category Submitted:", finalCategory); // ✅ Debugging

        const productData = {
            ...product,
            category: finalCategory, // ✅ Correct category
        };

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/products/add", productData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Product Added Successfully!");
            setProduct({ name: "", category: "", quantity: "", unit: "kg", price: "",costPrice:"", image: "", newCategory: "" });

        } catch (error) {
            console.error("Failed to add product:", error.response ? error.response.data : error);
            alert("Failed to add product.");
        }
    };


    return (
        <div className="product-container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <label>Product Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} required />

                <label>Category:</label>
                <select name="category" value={product.category} onChange={handleCategoryChange} required>
                    <option value="" disabled>Select Category</option>
                    <option value="other">Other (Add New)</option> {/* 🆕 Option for new category */}
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                    <option value="other">Other (Add New)</option> {/* 🆕 Option for new category */}
                </select>

                {/* 🆕 Show input field if 'Other' is selected */}
                {product.category === "other" && (
                    <input
                        type="text"
                        name="newCategory"
                        placeholder="Enter new category"
                        value={product.newCategory || ""}
                        onChange={(e) => setProduct({ ...product, newCategory: e.target.value })}
                        required
                    />
                )}


                <label>Quantity:</label>
                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required />

                <label>Unit:</label>
                <select name="unit" value={product.unit} onChange={handleChange}>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="pcs">Pieces (pcs)</option>
                </select>

                <label>Cost Price:</label>
                <input
                    type="number"
                    name="costPrice"
                    value={product.costPrice || ""}
                    onChange={handleChange}
                    required
                />

                <label>Selling Price:</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} required />
            
                <label>Image URL (optional):</label>
                <input type="text" name="image" value={product.image} onChange={handleChange} />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default ProductForm;
