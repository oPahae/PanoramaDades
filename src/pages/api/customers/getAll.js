import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Customers ORDER BY dateCreation DESC'
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
}