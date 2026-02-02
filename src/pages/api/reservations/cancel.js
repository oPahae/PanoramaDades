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

    if (existingReservation[0].status === 'canceled') {
      throw new Error('Reservation is already canceled');
    }

    if (existingReservation[0].status === 'finished') {
      throw new Error('Cannot cancel a finished reservation');
    }

    await connection.query(
      `UPDATE Reservations 
       SET status = 'canceled'
       WHERE id = ?`,
      [id]
    );

    await connection.query(
      `DELETE FROM Factures 
       WHERE reservationID = ?`,
      [id]
    );

    await connection.commit();

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error canceling reservation:', error);
    res.status(500).json({ message: 'Error canceling reservation', error: error.message });
  } finally {
    connection.release();
  }
}