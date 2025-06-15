/* global process */
/* eslint-env node */
import 'dotenv/config';
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure JWT_SECRET is set early
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not defined. Please add it to backend/.env.");
  process.exit(1);
}

import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import userRoutes from './routes/userRoutes.js';
import thoughtRoutes from './routes/thoughtRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happythoughts";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// CORS: only allow our frontend origins
app.use(
  cors({
    origin: ["http://localhost:5173", "https://happythoughtstalo.netlify.app"],
  })
);

// JSON body parsing
app.use(express.json());

// 1) API documentation & welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints: listEndpoints(app),
  });
});

// Mount auth and thoughts routers
app.use('/auth', userRoutes);
app.use('/thoughts', thoughtRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
