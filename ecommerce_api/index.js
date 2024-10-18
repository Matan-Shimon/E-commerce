const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config(); // Load environment variables from a .env file

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.error("DB Connection Error:", err));

// Middleware
app.use(express.json()); // Parse JSON request bodies

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Update with your frontend URL
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Routes
app.use("/api/users", userRoute); // User management routes
app.use("/api/auth", authRoute); // Authentication routes
app.use("/api/products", productRoute); // Product management routes
app.use("/api/carts", cartRoute); // Cart management routes
app.use("/api/orders", orderRoute); // Order management routes
app.use("/api/checkout", stripeRoute); // Stripe payment routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
