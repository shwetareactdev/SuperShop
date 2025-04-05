const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");

exports.generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${invoice._id}.pdf`);
    doc.pipe(res);

    // 🏷️ Invoice Title
    doc.fontSize(20).font("Helvetica-Bold").fillColor("#333").text("INVOICE", { align: "center" });
    doc.moveDown();

    // 🟡 Company Info - Left
    doc.fontSize(14).fillColor("#1a1a1a").font("Helvetica-Bold").text("Super Shoppy Pvt Ltd", 50, 90);
    doc.fontSize(10).font("Helvetica").text("123, Main Street, Kolhapur", 50, 110);
    doc.text("Email: shwetareactdev@gmail.com", 50, 125);
    doc.text("Phone: 95610 94572", 50, 140);

    // 🟢 Customer Info - Right
    doc.fontSize(10).fillColor("#000")
      .font("Helvetica-Bold").text(`Invoice No:`, 400, 90)
      .font("Helvetica").text(`${invoice.invoiceNumber || "N/A"}`, 470, 90)

      .font("Helvetica-Bold").text(`Customer:`, 400, 105)
      .font("Helvetica").text(`${invoice.customerName || "N/A"}`, 470, 105)

      .font("Helvetica-Bold").text(`Phone:`, 400, 120)
      .font("Helvetica").text(`${invoice.customerPhone || "N/A"}`, 470, 120)

      .font("Helvetica-Bold").text(`Payment Method:`, 400, 135)
      .font("Helvetica").text(`${invoice.paymentMethod || "N/A"}`, 490, 135)

      .font("Helvetica-Bold").text(`Date:`, 400, 150)
      .font("Helvetica").text(`${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleString() : "N/A"}`, 440, 150);

    // 🔵 Table Header
    const tableTop = 180;
    const col1 = 50;
    const col2 = 200;
    const col3 = 260;
    const col4 = 330;
    const col5 = 420;

    doc.moveTo(col1, tableTop - 10).lineTo(550, tableTop - 10).strokeColor("#aaaaaa").stroke();

    doc.fontSize(11).fillColor("#333").font("Helvetica-Bold");
    doc.text("Product Name", col1, tableTop);
    doc.text("Qty", col2, tableTop);
    doc.text("Unit", col3, tableTop);
    doc.text("Price (₹)", col4, tableTop);
    doc.text("Total (₹)", col5, tableTop);

    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).strokeColor("#aaaaaa").stroke();

    // 🟠 Table Body
    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(10).fillColor("#000");

    invoice.products.forEach(p => {
      doc.text(p.productName, col1, y);
      doc.text(p.quantity.toString(), col2, y);
      doc.text(p.unit || "-", col3, y);
      doc.text(`₹${p.price.toFixed(2)}`, col4, y);
      doc.text(`₹${p.total.toFixed(2)}`, col5, y);
      y += 20;
    });

    doc.moveTo(col1, y).lineTo(550, y).strokeColor("#aaaaaa").stroke();

    // 🔴 Summary
    const summaryTop = y + 30;
    doc.fontSize(11).fillColor("#000");

    doc.font("Helvetica-Bold").text("Subtotal:", 350, summaryTop);
    doc.font("Helvetica").text(`₹${(invoice.subTotal || 0).toFixed(2)}`, 470, summaryTop, { align: "right" });

    doc.font("Helvetica-Bold").text(`Tax (${invoice.taxPercentage || 0}%):`, 350, summaryTop + 20);
    doc.font("Helvetica").text(`₹${(invoice.taxAmount || 0).toFixed(2)}`, 470, summaryTop + 20, { align: "right" });

    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000").text("Total Amount:", 350, summaryTop + 45);
    doc.font("Helvetica-Bold").text(`₹${(invoice.totalAmount || 0).toFixed(2)}`, 470, summaryTop + 45, { align: "right" });

    // 🧾 Footer Content
    doc.moveDown(4);
    doc.moveTo(50, summaryTop + 100).lineTo(550, summaryTop + 100).strokeColor("#cccccc").stroke();

    doc.fontSize(10).fillColor("#555");
    doc.text("Thank you for your purchase!", 50, summaryTop + 110);
    doc.text("We appreciate your support. For any queries or home delivery:", 50, summaryTop + 125);
    doc.font("Helvetica-Bold").fillColor("#000").text("Contact: 95610 94572 | Email: shwetareactdev@gmail.com", 50, summaryTop + 140);

    doc.fontSize(9).fillColor("#888").text("Visit again - Super Shoppy Pvt Ltd, Kolhapur", 50, summaryTop + 170, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ error: "Failed to generate invoice PDF" });
  }
};
