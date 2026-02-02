import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.RootAuthToken;

  if (!token) {
    return null;
  }

  try {
    const root = jwt.verify(token, JWT_SECRET);
    return { connected: true };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}