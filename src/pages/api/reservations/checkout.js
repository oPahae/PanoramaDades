import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Reservation ID is required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingReservation] = await connection.query(
      'SELECT status FROM Reservations WHERE id = ?',
      [id]
    );

    if (existingReservation.length === 0) {
      throw new Error('Reservation not found');
    }

    if (existingReservation[0].status !== 'paid') {
      throw new Error('Only paid reservations can be checked out');
    }

    await connection.query(
      `UPDATE Reservations 
       SET status = 'finished'
       WHERE id = ?`,
      [id]
    );

    await connection.commit();

    res.status(200).json({ message: 'Reservation checked out successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error checking out reservation:', error);
    res.status(500).json({ message: 'Error checking out reservation', error: error.message });
  } finally {
    connection.release();
  }
}