import { validationResult, check } from "express-validator";
import UserService from "../services/userService.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const validateDailyIntakeBody = async (req, res, next) => {
  await check("bloodType")
    .notEmpty()
    .withMessage("Blood type is required")
    .run(req);
  await check("age")
    .isInt({ gt: 0 })
    .withMessage("Age must be a positive integer")
    .run(req);
  await check("height")
    .isFloat({ gt: 0 })
    .withMessage("Height must be a positive number")
    .run(req);
  await check("currentWeight")
    .isFloat({ gt: 0 })
    .withMessage("Current weight must be a positive number")
    .run(req);
  await check("desiredWeight")
    .isFloat({ gt: 0 })
    .withMessage("Desired weight must be a positive number")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bloodType, age, height, currentWeight, desiredWeight } = req.body;
    req.parsedBody = {
      parsedAge: parseInt(age),
      parsedHeight: parseFloat(height),
      parsedCurrentWeight: parseFloat(currentWeight),
      parsedDesiredWeight: parseFloat(desiredWeight),
    };

    if (
      isNaN(req.parsedBody.parsedAge) ||
      isNaN(req.parsedBody.parsedHeight) ||
      isNaN(req.parsedBody.parsedCurrentWeight) ||
      isNaN(req.parsedBody.parsedDesiredWeight)
    ) {
      return res.status(400).json({ message: "Invalid parameter values" });
    }

    next();
  } catch (error) {
    console.error("Error processing request body:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const validateProductQuery = async (req, res, next) => {
  await check("bloodType")
    .notEmpty()
    .withMessage("Blood type is required")
    .run(req);
  await check("age")
    .isInt({ gt: 0 })
    .withMessage("Age must be a positive integer")
    .run(req);
  await check("height")
    .isFloat({ gt: 0 })
    .withMessage("Height must be a positive number")
    .run(req);
  await check("currentWeight")
    .isFloat({ gt: 0 })
    .withMessage("Current weight must be a positive number")
    .run(req);
  await check("desiredWeight")
    .isFloat({ gt: 0 })
    .withMessage("Desired weight must be a positive number")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
