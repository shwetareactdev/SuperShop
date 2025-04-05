// const mongoose = require("mongoose");

// const InvoiceSchema = new mongoose.Schema({
//     customerName: { type: String, required: true },
//     customerPhone: { type: String, required: true },
//     products: [
//         {
//             productName: String,
//             quantity: Number,
//             price: Number,
//             total: Number,
//         },
//     ],
//     totalAmount: { type: Number, required: true },
//     paymentMethod: { type: String, required: true },
//     invoiceDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Invoice", InvoiceSchema);




const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true, required: true }, // युनिक इन्वॉइस नंबर
    firmName: { type: String, default: "Super Shoppy" }, // कंपनीचे नाव
    firmAddress: { type: String, default: "Kolhapur, Maharashtra" }, // पत्ता
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    products: [
        {
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }, // Example: "kg", "g", "pcs"
            price: { type: Number, required: true },
            total: { type: Number, required: true },
        },
    ],
    subTotal: { type: Number, required: true }, // कर लागू करण्यापूर्वी एकूण
    taxPercentage: { type: Number, default: 0 }, // कर टक्केवारी (GST साठी)
    taxAmount: { type: Number, default: 0 }, // कराची एकूण रक्कम
    totalAmount: { type: Number, required: true }, // कर लावून अंतिम रक्कम
    paymentMethod: { type: String, required: true },
    invoiceDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
