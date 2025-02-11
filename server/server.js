require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const otpRoutes = require("./routes/otpRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
