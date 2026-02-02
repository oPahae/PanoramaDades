import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    const [rooms] = await pool.query('SELECT id FROM Rooms WHERE id = ?', [id]);
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await pool.query('DELETE FROM Rooms WHERE id = ?', [id]);
    res.status(200).json({ 
      message: 'Room deleted successfully',
      id: id 
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Database error' });
  }
}