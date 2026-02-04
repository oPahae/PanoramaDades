import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, email, subject, message } = req.body;

  if (!fullName || !message) {
    return res.status(400).json({
      message: 'fullName and message are required'
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Contacts (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [fullName, email || null, subject || null, message]
    );

    return res.status(201).json({
      message: 'Contact added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Database error'
    });
  }
}