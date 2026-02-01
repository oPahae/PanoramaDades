import pool from '../_connect';
import bcrypt from 'bcryptjs';

function generatePassword(length = 12) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';

  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const plainPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result] = await pool.query(
      'INSERT INTO agents (name, email, phone, password, dateCreation) VALUES (?, ?, ?, ?, NOW())',
      [name.trim(), email.trim(), phone?.trim() || null, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      password: plainPassword,
      message: 'Agent created successfully. Please save this password as it will not be shown again.'
    });
  } catch (error) {
    console.error('Error adding agent:', error);
    return res.status(500).json({ error: 'Failed to add agent' });
  }
}