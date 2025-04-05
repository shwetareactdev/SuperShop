const Invoice = require("../models/Invoice");

exports.getSalesData = async (req, res) => {
    try {
        const invoices = await Invoice.find();

        let salesData = invoices.map((invoice) => ({
            date: invoice.invoiceDate.toISOString().split("T")[0],
            amount: invoice.totalAmount,
        }));

        res.json(salesData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching sales data" });
    }
};
