import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.AgentAuthToken;

  if (!token) {
    return null;
  }

  try {
    const agent = jwt.verify(token, JWT_SECRET);
    return { id: agent.id, name: agent.name, phone: agent.phone, email: agent.email, dateCreation: agent.dateCreation };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}