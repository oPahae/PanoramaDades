import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Client ID is required' });
  }

  try {
    const [clients] = await pool.query('SELECT * FROM Customers WHERE id = ?', [id]);
    
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const [reservations] = await pool.query(
      'SELECT COUNT(*) as count FROM Reservations WHERE customerID = ?',
      [id]
    );

    if (reservations[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete client with existing reservations',
        reservationCount: reservations[0].count
      });
    }

    await pool.query('DELETE FROM Customers WHERE id = ?', [id]);

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
}