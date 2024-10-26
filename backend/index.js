import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import logger from "morgan";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();
console.log("SECRET_KEY:", process.env.SECRET_KEY);

const app = express();

// Connect to database
connectDB();

// For logging
app.use(morgan("dev"));
// Middleware
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json());

// Middleware for logging request body
app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  next(); // Proceed to the next middleware or route handler
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", productRoutes);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use(errorHandler);

export default app;
