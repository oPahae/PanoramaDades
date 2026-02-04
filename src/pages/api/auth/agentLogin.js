import pool from '../_connect';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Agents WHERE name = ?',
      [name]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    const agent = rows[0];

    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    const token = jwt.sign(
      {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        dateCreation: agent.dateCreation,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = serialize('AgentAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      message: 'Login successful',
      agent: {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        dateCreation: agent.dateCreation,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}