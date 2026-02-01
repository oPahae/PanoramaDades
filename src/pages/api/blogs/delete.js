import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Blog ID is required' });
  }

  try {
    const connection = await pool.getConnection();

    const [blogRows] = await connection.query(
      'SELECT id FROM Blogs WHERE id = ?',
      [id]
    );

    if (blogRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Blog not found' });
    }

    await connection.query('DELETE FROM Blogs WHERE id = ?', [id]);

    connection.release();

    return res.status(200).json({ 
      message: 'Blog deleted successfully',
      id: id
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}