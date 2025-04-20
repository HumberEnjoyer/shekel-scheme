import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// middleware function to verify the jwt token
export const verifyToken = async (req, res, next) => {
  // retrieve the authorization header from the request
  const authHeader = req.headers.authorization;

  // check if the authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  // extract the token from the authorization header
  const token = authHeader.split(" ")[1];

  try {
    // verify the token using the jwt secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user associated with the token and exclude the password field
    req.user = await User.findById(decoded.id).select("-password");

    // check if the user exists
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    // proceed to the next middleware or route handler
    next();
  } catch (error) {
    // handle errors during token verification
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};