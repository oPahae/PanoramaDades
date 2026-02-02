import pool from '../_connect';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Root WHERE 1=1 LIMIT 1',
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'No roots found' });
    }

    const root = rows[0];

    if (root.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        connected: true,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = serialize('RootAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      message: 'Login successful',
      root: {
        connected: true,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}