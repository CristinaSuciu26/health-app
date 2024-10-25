import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserService from "../services/userService.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_TOKEN_EXPIRATION = "8s";
const REFRESH_TOKEN_EXPIRATION = "7d";

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY must be defined in the environment variables.");
}

// Register route handler
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = jwt.sign({ id: newUser._id }, SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    await UserService.updateUserToken(newUser._id, accessToken, refreshToken);

    return res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error processing user signup request:", error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Login route handler
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserService.findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    await UserService.updateUserToken(existingUser._id, accessToken);
    await UserService.createRefreshToken(existingUser._id, refreshToken);

    return res.status(200).json({
      user: {
        name: existingUser.name,
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error processing user login request:", error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Refresh token route handler
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.error("No token provided");
      return res.status(403).json({ message: "No token provided" });
    }

    const tokenDoc = await UserService.findRefreshToken(token);
    console.log("Token document:", tokenDoc);

    if (!tokenDoc) {
      console.error("Token not found");
      return res.status(403).json({ message: "Token not found" });
    }
    if (!tokenDoc || new Date() > tokenDoc.expiresAt) {
      console.error("Invalid or expired refresh token");
      return res
        .status(401)
        .json({ message: "Refresh token has expired, please log in again" });
    }
    if (new Date() > tokenDoc.expiresAt) {
      console.error("Expired token", { token, expiresAt: tokenDoc.expiresAt });
      return res.status(403).json({ message: "Expired token" });
    }

    const { id } = jwt.verify(token, SECRET_KEY);

    const newAccessToken = jwt.sign({ id }, SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout route handler
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.user) {
      return res
        .status(400)
        .json({ message: "User not found or not logged in." });
    }
    await UserService.updateUserToken(userId, null);

    res.status(204).send();
  } catch (error) {
    console.error("Error processing user logout request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
