const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose"); // <-- Add this line!
const connectDB = require("./config/db"); // Database Connection
const salesRoutes = require("./routes/salesRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const configureSocket = require("./routes/socketRoutes");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // User मॉडेल योग्यरित्या इम्पोर्ट
// **Routes**
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// **MongoDB कनेक्शन सेटअप**
connectDB();

const app = express();
const server = http.createServer(app);
const io = configureSocket(server);
app.set("io", io);

// **Middleware**
app.use(express.json());
app.use(cors());

// **Create Admin (फक्त एकदाच तयार होईल)**
async function createAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

// MongoDB कनेक्शन पूर्ण झाल्यावर admin तयार करा
mongoose.connection.once("open", () => {
  console.log("🚀 MongoDB Connected!");
  createAdmin();
});

// **Routes**
app.use("/api/admin", require("./routes/authRoutes"));
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/sales", salesRoutes);





// **API Routes**
app.use("/api/admin", authRoutes);

// **Start Server**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
