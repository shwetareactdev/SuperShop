const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Product = require("../models/Product"); // 🔹 Product मॉडेल इम्पोर्ट करणे विसरलो होतो!
const { generateInvoicePDF } = require("../controllers/invoiceController");

router.post("/create", async (req, res) => {
    try {
        const invoiceData = req.body;
        const updatedProducts = [];

        // ✅ Check if invoiceNumber already exists
        const existingInvoice = await Invoice.findOne({ invoiceNumber: invoiceData.invoiceNumber });
        if (existingInvoice) {
            return res.status(400).json({ error: "Invoice number already exists!" });
        }

        // ✅ Stock कमी करण्याचा लॉजिक
        for (const item of invoiceData.products) {
            const product = await Product.findOne({ name: item.productName });

            if (!product) {
                console.log(`❌ Product '${item.productName}' not found!`);
                return res.status(404).json({ error: `Product '${item.productName}' not found!` });
            }

            if (product.quantity < item.quantity) {
                console.log(`❌ Insufficient stock for '${item.productName}'!`);
                return res.status(400).json({ error: `Insufficient stock for '${item.productName}'!` });
            }

            console.log(`🛒 Reducing stock for ${product.name}: ${product.quantity} → ${product.quantity - item.quantity}`);
            product.quantity -= item.quantity;
            await product.save();

            // ✅ नवीन स्टॉक व्हॅल्यू frontend साठी ठेवतो
            updatedProducts.push({ name: product.name, newStock: product.quantity });
        }

        // ✅ Invoice तयार करून DB मध्ये सेव्ह करतो
        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();

        // ✅ Emit event to frontend for real-time update
        req.app.get("io").emit("stockUpdated", updatedProducts); // Emit the updated stock information

        res.json({ 
            msg: "Invoice saved successfully", 
            invoice: newInvoice,
            updatedProducts // Send updated products to frontend
        });

    } catch (err) {
        console.error("❌ Backend Error:", err);
        res.status(500).json({ error: err.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Generate PDF

router.get("/download/:id", generateInvoicePDF); // ⬅️ Route for downloading invoice PDF




//Search code 
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // फ्रंटएंडकडून आलेला search query
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const invoices = await Invoice.find({
            $or: [
                { invoiceNumber: { $regex: query, $options: "i" } },
                { customerName: { $regex: query, $options: "i" } },
                { customerPhone: { $regex: query, $options: "i" } }
            ]
        });

        res.json(invoices);
    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ error: err.message });
    }
});
//Delete 
router.delete("/:id", async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ error: "Invoice not found!" });
        }
        res.json({ msg: "Invoice deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update / Edit
router.put("/:id", async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ error: "Invoice not found!" });
        }
        res.json(updatedInvoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Total invoices count API
router.get("/count", async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        res.json({ total: totalInvoices });
    } catch (error) {
        console.error("Error fetching total invoices:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/profit-loss", async (req, res) => {
    try {
        // ✅ Step 1: Fetch all invoices
        const invoices = await Invoice.find({});
        console.log("📌 Invoices Fetched:", invoices); // Debugging
        
        // ✅ Step 2: Calculate Total Revenue
        const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
        console.log("📌 Total Revenue:", totalRevenue); // Debugging
        
        // ✅ Step 3: Fetch all products
        const products = await Product.find({});
        console.log("📌 Products Fetched:", products); // Debugging
        
        // ✅ Step 4: Create Product Map
        const productMap = new Map(products.map(product => [product.name, product.costPrice]));
        console.log("📌 Product Map:", productMap); // Debugging
        
        // ✅ Step 5: Calculate Total Cost
        let totalCost = 0;
        invoices.forEach(invoice => {
            invoice.products.forEach(item => {
                const costPrice = productMap.get(item.productName) || 0;
                console.log(`📌 Product: ${item.productName}, Cost Price: ${costPrice}, Quantity: ${item.quantity}`);
                totalCost += item.quantity * costPrice;
            });
        });
        
        console.log("📌 Total Cost Calculated:", totalCost); // Debugging
        
        // ✅ Step 6: Calculate Profit or Loss
        const profitOrLoss = totalRevenue - totalCost;
        const status = profitOrLoss >= 0 ? "Profit" : "Loss";

        res.json({ totalRevenue, totalCost, profitOrLoss, status });
    } catch (error) {
        console.error("❌ Error calculating profit/loss:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
