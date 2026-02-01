import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, customerID, roomID, checkIn, checkOut, amount, discount, tva } = req.body;

  if (!id || !customerID || !roomID || !checkIn || !checkOut || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
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

    if (existingReservation[0].status === 'canceled' || existingReservation[0].status === 'finished') {
      throw new Error('Cannot update a canceled or finished reservation');
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      throw new Error('Check-out date must be after check-in date');
    }

    const [conflictingReservations] = await connection.query(
      `SELECT id FROM Reservations 
       WHERE roomID = ? 
       AND id != ?
       AND status NOT IN ('canceled', 'finished')
       AND (
         (checkIn <= ? AND checkOut > ?) OR
         (checkIn < ? AND checkOut >= ?) OR
         (checkIn >= ? AND checkOut <= ?)
       )`,
      [roomID, id, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut]
    );

    if (conflictingReservations.length > 0) {
      throw new Error('Room is already reserved for these dates');
    }

    await connection.query(
      `UPDATE Reservations 
       SET customerID = ?, roomID = ?, checkIn = ?, checkOut = ?, amount = ?, discount = ?, tva = ?
       WHERE id = ?`,
      [customerID, roomID, checkIn, checkOut, amount, discount || 0, tva || 0, id]
    );

    const discountAmount = amount * ((discount || 0) / 100);
    const afterDiscount = amount - discountAmount;
    const tvaAmount = afterDiscount * ((tva || 0) / 100);
    const totalAmount = afterDiscount + tvaAmount;

    await connection.query(
      `UPDATE Factures 
       SET amount = ?
       WHERE reservationID = ?`,
      [totalAmount, id]
    );

    await connection.commit();

    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Error updating reservation', error: error.message });
  } finally {
    connection.release();
  }
}