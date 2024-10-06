import jwt from "jsonwebtoken";
import UserService from "../services/userService.js";

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized - No auth header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await UserService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized - User not found" });
    }

    if (user.token !== token) {
      return res.status(401).json({ message: "Not authorized - Token mismatch" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized - Invalid token" });
  }
};

export default authMiddleware;