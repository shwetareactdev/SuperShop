const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // Example: "kg", "g", "pcs"
    price: { type: Number, required: true }, //selling price
    costPrice: { type: Number, required: true },  // 🆕 Purchase Cost Price (मग `totalCost` येईल)
    image: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
