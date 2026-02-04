import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();

    const [faqs] = await connection.query(
      'SELECT id, question, response FROM Faqs ORDER BY id DESC'
    );

    connection.release();

    return res.status(200).json(faqs);

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}