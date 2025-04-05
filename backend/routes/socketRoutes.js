// const io = require("socket.io")(server, { cors: { origin: "*" } });




// router.post("/create", async (req, res) => {
//     try {
//         const invoiceData = req.body;
//         const updatedProducts = [];

//         for (const item of invoiceData.products) {
//             const product = await Product.findOne({ name: item.productName });

//             if (!product) {
//                 return res.status(404).json({ error: `Product '${item.productName}' not found!` });
//             }

//             if (product.quantity < item.quantity) {
//                 return res.status(400).json({ error: `Insufficient stock for '${item.productName}'!` });
//             }

//             product.quantity -= item.quantity;
//             await product.save();

//             updatedProducts.push({ name: product.name, newStock: product.quantity });
//         }

//         const newInvoice = new Invoice(invoiceData);
//         await newInvoice.save();

//         // ✅ Emit event to frontend for real-time update
//         io.emit("stockUpdated", updatedProducts);

//         res.json({ msg: "Invoice saved successfully", updatedProducts });

//     } catch (err) {
//         console.error("❌ Backend Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });
const socketIo = require("socket.io");

const configureSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // Allow connections from all domains
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
};

module.exports = configureSocket;
