import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { question, response } = req.body;

  if (!question || !response) {
    return res.status(400).json({ message: 'Question and response are required' });
  }

  if (question.trim() === '' || response.trim() === '') {
    return res.status(400).json({ message: 'Question and response cannot be empty' });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO Faqs (question, response) VALUES (?, ?)',
      [question.trim(), response.trim()]
    );

    connection.release();

    return res.status(201).json({
      message: 'FAQ added successfully',
      faqId: result.insertId
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}