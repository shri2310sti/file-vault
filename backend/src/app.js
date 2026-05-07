require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/files");

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded files statically (for image preview)
app.use("/uploads", express.static("uploads"));

app.use("/files", fileRoutes);

app.get("/", (req, res) => res.json({ status: "File Vault API running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));