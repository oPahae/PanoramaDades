import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, subject, message
       FROM Contacts
       ORDER BY id DESC`
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Database error'
    });
  }
}