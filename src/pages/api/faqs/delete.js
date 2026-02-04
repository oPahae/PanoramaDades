import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'FAQ ID is required' });
  }

  try {
    const connection = await pool.getConnection();

    const [faqRows] = await connection.query(
      'SELECT id FROM Faqs WHERE id = ?',
      [id]
    );

    if (faqRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await connection.query('DELETE FROM Faqs WHERE id = ?', [id]);

    connection.release();

    return res.status(200).json({
      message: 'FAQ deleted successfully',
      id: id
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}