// const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("MongoDB Connected...");
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000, // ✅ Timeout वाढव
            socketTimeoutMS: 45000 // ✅ Extra timeout
        });
        console.log("MongoDB Connected!");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
