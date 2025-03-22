import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import functions from "firebase-functions";

const app = express();

// Enable CORS for frontend requests
app.use(cors({origin: true}));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

// API to create Razorpay order
app.post("/create-order", async (req: any, res: any) => {
  try {
    const {amount, currency} = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({error: "Failed to create order"});
  }
});

// Deploy the function
exports.razorpay = functions.https.onRequest(app);
