const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection is Failed", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;