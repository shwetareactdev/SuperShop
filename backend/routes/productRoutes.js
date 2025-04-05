const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Add Product
router.post("/add", async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging
        
        const { name, category, quantity, unit, price, costPrice, image } = req.body;

        if (!name || !category || !quantity || !unit || !price) {
            return res.status(400).json({ error: "All fields except image are required!" });
        }

        const newProduct = new Product({ name, category, quantity, unit, price,costPrice, image });
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔵 Get All Products
// 🔵 Get All Products (WITHOUT AUTH)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🟠 Update Product
// 🟠 Update Product
// 🟠 Update Product (All Fields Update)
router.put("/update/:id", async (req, res) => {
    try {
        const { name, category, quantity, unit, price, costPrice,image } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, quantity, unit, price,costPrice, image },
            { new: true }
        );
        res.json({ msg: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔴 Delete Product
// router.delete("/delete/:id", async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ msg: "Product deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
router.delete("/delete/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ msg: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ✅ Available products fetch करणारा API
router.get("/available", async (req, res) => {
    try {
        const products = await Product.find({}, "name price"); // फक्त name आणि price पाठवायचं
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

//Search products
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Name match
                { category: { $regex: query, $options: "i" } } // Category match
            ]
        });

        res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/categories", async (req, res) => {
    try {
        let categories = await Product.distinct("category");
        categories = categories
            .map((cat) => cat.trim()) // ✅ Remove extra spaces
            .filter((cat, index, self) => cat && self.indexOf(cat) === index); // ✅ Remove duplicates & empty values
        console.log("Fetched Categories:", categories);
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
});


// ✅ Get total product count
router.get("/count", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments(); // Count all products
        res.json({ total: totalProducts });
    } catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ error: "Failed to fetch product count" });
    }
});



module.exports = router;
