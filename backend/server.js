import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Thought from "./models/Thought.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_here";

// Connect to MongoDB
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happythoughts";
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

// Register route
app.post(
  "/auth/register",
  body("username").isLength({ min: 3 }),
  body("password").isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// Login route
app.post(
  "/auth/login",
  body("username").exists(),
  body("password").exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

// 1) API documentation & welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints: listEndpoints(app),
  });
});

// 2) Collection endpoint: paginated, filtered & sorted
app.get("/thoughts", async (req, res, next) => {
  try {
    // Parse query params, with sensible defaults
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);

    // Parse hearts filters: exact or minimum
    const { hearts, minHearts } = req.query;
    let filter = {};
    if (hearts != null) {
      filter.hearts = Number(hearts);
    } else if (minHearts != null) {
      filter.hearts = { $gte: Number(minHearts) };
    }

    // Parse sort parameters: field and direction
    const { sortBy, order } = req.query;
    const field = sortBy === 'hearts' ? 'hearts' : 'createdAt';
    const direction = order === 'asc' ? 1 : -1;

    // Count total matching documents
    const totalCount = await Thought.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch the requested page
    const thoughts = await Thought.find(filter)
      .sort({ [field]: direction })
      .skip((page - 1) * limit)
      .limit(limit);

    // Return data + pagination meta
    res.status(200).json({
      meta: { page, limit, totalCount, totalPages },
      thoughts
    });
  } catch (err) {
    next(err);
  }
});

// 3) Single‐item endpoint: get one thought by ID
app.get("/thoughts/:id", async (req, res, next) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res
        .status(404)
        .json({ error: `Thought with ID '${req.params.id}' not found` });
    }
    res.status(200).json(thought);
  } catch (err) {
    next(err);
  }
});

// 4) Create a new thought
app.post("/thoughts", async (req, res, next) => {
  try {
    const { message } = req.body;
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    next(err);
  }
});

// 5) Update a thought (edit message or hearts)
app.put("/thoughts/:id", async (req, res, next) => {
  try {
    const updated = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ error: `Thought with ID '${req.params.id}' not found` });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// 6) Delete a thought
app.delete("/thoughts/:id", async (req, res, next) => {
  try {
    const deleted = await Thought.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Thought with ID '${req.params.id}' not found` });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
